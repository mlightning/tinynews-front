// ----------------
//   Dependencies
// ----------------
var Cluster                     = require('cluster');
var Express                     = require('express');
var http                        = require('http');
var path                        = require('path');
var Config                      = require('./config.json');
var fs                          = require('fs');
var RedisStore                  = require('connect-redis')(Express);
var Flash                       = require('connect-flash');
var Util                        = require('util');

// Routers
var HomeRouter                  = require('./routes/home');
var UserRouter                  = require('./routes/user');
var CommonRouter                = require('./routes/common');
var GroupRouter                 = require('./routes/group');
var JournalistRouter            = require('./routes/journalist');
var ArticleRouter               = require('./routes/article');
var PublisherRouter             = require('./routes/publisher');
var AdminFeedsSystem            = require('./routes/admin/feeds');
var ImageUploaderRouter         = require('./routes/image_uploader');
var AdminUsersManageRouter      = require('./routes/admin/users');
// Shared Core
var Core                        = require('tinynews-common');

// Models
var User                        = Core.Models.User;

// Import AngularJS for Common Models
Core.Assets.Angular.Import(__dirname.toString() + '/public/js/_common/');
var ExpressHelpers              = require('./utils/express_helpers');

// --------------------------
//   Server Settings & Init
// --------------------------

var Settings = {
    cpu_cores: require('os').cpus().length,
    port:      Config.server_port,
    debug_on:  true
}

var app = Express();
app.configure(function() {
    app.set('port', process.env.PORT || Settings.port);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(Express.favicon());
    app.use(Express.logger('dev'));

    // disable Express Body parser for multipart/form-data post request - for stream upload, no need to write this to temporary file
    app.use(Express.json());
    app.use(Express.urlencoded());

    app.use(Express.methodOverride());
    app.use(Express.cookieParser('SfseVTjhsekwfoGH3ehof'));
    app.use(Express.session({
        store: new RedisStore({
            host: Core.Config.redis.host,
            port: Core.Config.redis.port
        }),
        secret: 'WECsfwWSGH34hjHw4tgfsefgwWdfsF'
    }));
    app.use(Flash());
    app.use(Express.static(path.join(__dirname, 'public')));
    //app.use(Passport.initialize());
    //app.use(Passport.session());
    app.use(Express.errorHandler({ dumpExceptions: true, showStack: true }));
    app.use(app.router);
});

app.configure('development', function() {
    app.use(Express.errorHandler({ dumpExceptions: true, showStack: true }));
});


// ------------------------
//   Middleware Helpers
// ------------------------

var Sessioned = function(req, res, next) {
    if (req.session && req.session.token) {
        console.log('Has Token');
        Core.Auth.Tokens.Authenticate(req.session.token, function(token) {
            if (token.user.password) {
                delete token.user.password;
            }
            req.token = token;
            if (token.is_valid) {
                // Valid logged in user
                req.token.token = req.session.token;
                next();
            } else {
                // Invalid token
                res.redirect('/logout');
            }
        });
    } else {
        console.log('Issued Token');
        req.session.token = Core.Auth.Tokens.IssueAnonymous();

        Core.Auth.Tokens.Authenticate(req.session.token, function(token) {
            req.token = token;
            if (token.is_valid) {
                // Valid logged in user
                req.token.token = req.session.token;
                next();
            } else {
                // Invalid token
                res.redirect('/logout');
            }
        });
    }
}

var Authenticate = function(req, res, next) {
    if (req.session && req.session.token) {
        Sessioned(req, res, next);
    } else {
        res.redirect('/logout');
    }
}

// ------------------------
//   Template Stuff
// ------------------------

app.locals.get_assets = ExpressHelpers.GetAssets;

// ------------------------
//   App Routing
// ------------------------

// Home
app.get('/',                            Sessioned,      HomeRouter.index);
app.get('/about',                       Sessioned,      HomeRouter.about);
app.get('/about/ratings',               Sessioned,      HomeRouter.about_our_ratings);
app.get('/terms',                       Sessioned,      HomeRouter.terms);
app.get('/search',                      Sessioned,      HomeRouter.search);
app.get('/contact',                     Sessioned,      HomeRouter.contact);
app.get('/faq',                         Sessioned,      HomeRouter.faq);
app.get('/privacy',                     Sessioned,      HomeRouter.privacy);

// Common
app.get('/404',                                         CommonRouter.not_found);
app.get('/login',                       Sessioned,      CommonRouter.login);
app.post('/login',                                      CommonRouter.process_login);
app.get('/login_as/:user_id',           Authenticate,   CommonRouter.process_login_as);
app.get('/logout',                                      CommonRouter.logout);
app.get('/register',                    Sessioned,      CommonRouter.register);
app.post('/register',                   Sessioned,      CommonRouter.process_registration);
app.get('/reset/:key',                  Sessioned,      CommonRouter.password_reset);
app.get('/reset',                       Sessioned,      CommonRouter.password_reset);
app.post('/reset',                      Sessioned,      CommonRouter.password_reset);
app.get('/recovery',                    Sessioned,      CommonRouter.password_recovery);
app.post('/recovery',                   Sessioned,      CommonRouter.password_recovery);
app.get('/confirm/:code',               Sessioned,      CommonRouter.confirm_email);

// User
app.get('/profile',                     Authenticate,   UserRouter.view_profile);
app.get('/profile/feed',                Authenticate,   UserRouter.manage_feed);
app.get('/profile/settings',            Authenticate,   UserRouter.account_settings);
app.get('/profile/:user_id',            Sessioned,      UserRouter.view_profile);

// Group
app.get('/group/create',                Sessioned,      GroupRouter.create);
app.get('/group/:slug',                 Sessioned,      GroupRouter.view_profile);


// Publisher
app.get('/publishers',                  Sessioned,      PublisherRouter.list);
app.get('/publisher/:slug',             Sessioned,      PublisherRouter.view_profile);

// Journalist
app.get('/journalists',                 Sessioned,      JournalistRouter.list);
app.get('/journalist/:slug',            Sessioned,      JournalistRouter.view_profile);

// Article
app.get('/editors-choice',              Sessioned,      ArticleRouter.editors_choice);
app.get('/article/:slug',               Sessioned,      ArticleRouter.view);
app.get('/article/:slug/edit',          Authenticate,   ArticleRouter.editor);

// Health Monitor
app.get('/monitor',                                     CommonRouter.monitor);


// Image Uploading
app.post('/imguploader',                Authenticate,   ImageUploaderRouter.upload);

// --
// Admin Routing
// --

// Feeds System
app.get('/admin/feeds/manage',          Authenticate,   AdminFeedsSystem.manage);

// Users management
app.get('/admin/users',                 Authenticate,   AdminUsersManageRouter.manage);


app.use( CommonRouter.not_found );

// ----------------
//   Start Server
// ----------------
Core.Database.connect(Core.Config, function(e) {
    if (e) {
        Util.log(e);
        Util.log("TinyNews.com shutting down...");
    } else {
        Util.log("OrientDB connection available.");

        http.createServer(app).listen(app.get('port'), function() {
            Util.log("Express listening on port " + app.get('port'));
        });
    }
})
