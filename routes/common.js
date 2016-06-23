// ----------------
//   Dependencies
// ----------------

var Config      = require('../config.json');
var crypto      = require('crypto');
var Util        = require('util');
var UUID        = require('node-uuid');
var RID         = require('../utils/rid');
var Async       = require('async');

var Redis       = require('redis');
var Kue         = require('kue');

// Shared Core
var Core        = require('tinynews-common');

// Models
var User        = Core.Models.User;

Kue.redis.createClient = function() {
    return Redis.createClient(Core.Config.redis.port, Core.Config.redis.host);
}
var ResetKeyStore = Redis.createClient(Core.Config.redis.port, Core.Config.redis.host);

var Jobs = Kue.createQueue();

// -----------------
//   404 Not Found
// -----------------
exports.not_found = function(req, res) {
    res.setHeader('Cache-Control', 'public, max-age=' + (3600 * 12));
    res.setHeader('Vary', 'Accept Encoding');

    var conf = Util._extend({}, Config);
    conf.theme = 'default';
    conf.hide_nav = true;
    conf.body_classes = ['page-404-full-page'];

    res.status(404);
    res.render('common/404', {
        config: conf,
        session: req.session,
        token: false,
        flash: req.flash(),
        title: 'Page Not Found (404)',
        section: false,
        data: false
    });
}

// -----------------
//   Login Form
// -----------------
exports.login = function(req, res) {
    // Logged in Users should not see the login screen
    if (req.session && req.session.token && req.token && req.token.user && req.token.user['@rid']) {
        res.redirect('/profile');
        return;
    }

    var conf = Util._extend({}, Config);
    conf.theme = 'default';
    conf.hide_nav = true;
    conf.body_classes = ['login'];

    res.render('common/login', {
        config: conf,
        session: req.session,
        token: false,
        flash: req.flash(),
        title: 'Log into TinyNews',
        section: false,
        data: false
    });
}

// -----------------
//   Process Login As Another user
// -----------------
exports.process_login_as = function(req, res) {
    if (!req.token || !req.token.user.permissions['user.admin']) {
        res.redirect('/404');
    }

    if (!req.params.user_id) {
        res.redirect('/404');
    }

    User.Find({ where: {
        'handle': req.params.user_id
    }}, function(e, user) {
        if (!e && user) {
            user._load_permissions(function(e) {
                if (e) {
                    console.log(e);
                    req.flash('error', 'There was a problem processing your login.');
                    res.redirect('/login');
                } else {

                    user.get_feed_settings(function(e, settings) {
                        if (e) {
                            console.log(e);
                            req.flash('error', 'There was a problem processing your login.');
                            res.redirect('/login');
                        } else {
                            try {
                                user.settings = settings;
                                req.session.token = Core.Auth.Tokens.Issue(user);
                                res.redirect('/');
                            }
                            catch(e){
                                console.log(e);
                            }
                        }
                    });
                }
            });
        } else {
            if (e) {
                console.log(e);
                req.flash('error', 'There was a problem processing your login.');
            } else {
                req.flash('error', 'Sorry, those credentials aren\'t valid.');
            }
            res.redirect('/login');
        }
    });
}

// -----------------
//   Process Login
// -----------------
exports.process_login = function(req, res) {
    req.body.name = Core.Database.escape(req.body.name);

    User.Find({
        where:
            "(handle = '" + req.body.name + "' OR email = '" + req.body.name + "')" +
            " AND password = '" + crypto.createHash('sha1').update(req.body.password).digest('hex') + "'" +
            " AND status = " + User.Status.ACTIVE
    }, function(e, user) {
        if (!e && user) {
            user._load_permissions(function(e) {
                if (e) {
                    console.log(e);
                    req.flash('error', 'There was a problem processing your login.');
                    res.redirect('/login');
                } else {

                    user.get_feed_settings(function(e, settings) {
                        if (e) {
                            console.log(e);
                            req.flash('error', 'There was a problem processing your login.');
                            res.redirect('/login');
                        } else {
                            try {
                                user.settings = settings;
                                req.session.token = Core.Auth.Tokens.Issue(user);
                                res.redirect('/');
                            }
                            catch(e){
                                console.log(e);
                            }
                        }
                    });
                }
            });
        } else {
            if (e) {
                console.log(e);
                req.flash('error', 'There was a problem processing your login.');
            } else {
                req.flash('error', 'Sorry, those credentials aren\'t valid.');
            }
            res.redirect('/login');
        }
    });
}

// -----------------
//   Logout
// -----------------
exports.logout = function(req, res) {
    req.session.token = null;
    delete req.session.token;
    res.redirect('/login');
}

// -----------------
//   Registration
// -----------------
exports.register = function(req, res) {
    // Logged in Users should not see the register screen
    if (req.session && req.session.token && req.token && req.token.user && req.token.user['@rid']) {
        res.redirect('/profile');
        return;
    }

    var conf = Util._extend({}, Config);
    conf.theme = 'default';
    conf.hide_nav = true;
    conf.body_classes = ['login'];

    res.render('common/register', {
        config: conf,
        session: req.session,
        token: false,
        flash: req.flash(),
        title: 'Register',
        section: false,
        data: false
    });
}

// ---------------------
//   Password Recovery
// ---------------------
exports.password_recovery = function(req, res) {
    var conf = Util._extend({}, Config);
    conf.theme = 'default';
    conf.hide_nav = true;
    conf.body_classes = ['login'];

    if (req.body.email) {

        User.Find({ where: { email: req.body.email }}, function(e, user) {
            if (e) {
                console.log('password_recovery', e);
                Util.log('Password Recovery Failed');
            } else if (!user) {
                // No User with that email
                res.render('common/password_recovery', {
                    config: conf,
                    session: req.session,
                    token: false,
                    flash: req.flash(),
                    title: 'Password Recovery',
                    section: false,
                    data: false
                });
            } else {
                // Found the user

                // Create a reset key
                var reset_key = UUID.v4();
                ResetKeyStore.setex('reset_key_' + reset_key.toString(), (86400 * 3), user.email);

                // Send Reset Link Email
                var job = Jobs.create('email_password_recovery', {
                    title: 'Email: Password Recovery Link',
                    key: reset_key,
                    email: user.email
                }).priority('high').save();

                /*var completed = setTimeout(function() {
                    Util.log('Email Job Failed');
                    req.flash('error', 'We ran into some problems trying to send your recovery email.');
                    res.redirect('/recovery');
                    return;
                }, 15000);*/

                job
                    .on('complete', function() {
                        Util.log('Email Job Succeeded');
                        req.flash('success', 'Password recovery link sent.');
                        res.redirect('/recovery');
                        //clearTimeout(completed);
                    })
                    .on('failed', function(e) {
                        console.log('password_recovery(failed)', e);
                        Util.log('Email Job Failed');
                        req.flash('error', 'We ran into some problems trying to send your recovery email.');
                        res.redirect('/recovery');
                        //clearTimeout(completed);
                    });
            }
        });

    } else {
        res.render('common/password_recovery', {
            config: conf,
            session: req.session,
            token: false,
            flash: req.flash(),
            title: 'Password Recovery',
            section: false,
            data: false
        });
    }
}

// -------------------------
//   Password Change/Reset
// -------------------------
exports.password_reset = function(req, res) {
    var conf = Util._extend({}, Config);
    conf.theme = 'default';
    conf.hide_nav = true;
    conf.body_classes = ['login'];

    if (req.params.key) {

        // --
        // User is redeeming a key
        // --

        ResetKeyStore.get('reset_key_' + req.params.key, function (e, email) {
            if (e || !email) {
                console.log('password_recovery redis', e);
                req.flash('error', 'Your reset period has expired, please reset your password again.');
                res.redirect('/recovery');
            } else {
                User.Find({ where: { email: email }}, function (e, user) {
                    if (e) {
                        console.log('password_recovery', e);
                        req.flash('error', 'Your reset period has expired, please reset your password again.');
                        res.redirect('/recovery');
                    } else if (!user) {
                        // No User with that email
                        req.flash('error', 'Your reset period has expired, please reset your password again.');
                        res.redirect('/recovery');
                    } else {
                        // Found the user

                        var data = { key: req.params.key };

                        res.render('common/password_reset', {
                            config: conf,
                            session: req.session,
                            token: false,
                            flash: req.flash(),
                            title: 'Password Recovery',
                            section: false,
                            data: data
                        });
                    }
                });
            }
        });

    } else if (req.body.password && req.body.password2 && req.body.key) {

        // --
        // User initiating the password change
        // --

        ResetKeyStore.get('reset_key_' + req.body.key, function (e, email) {
            if (e || !email) {
                console.log('password_recovery redis', e);
                req.flash('error', 'Your reset period has expired, please reset your password again.');
                res.redirect('/recovery');
            } else {
                User.Find({ where: { email: email }}, function (e, user) {
                    if (e) {
                        console.log('password_change User.Find', e);
                        req.flash('error', 'Your reset period has expired, please reset your password again.');
                        res.redirect('/recovery');
                    } else if (!user) {
                        // No User with that email
                        req.flash('error', 'Your reset period has expired, please reset your password again.');
                        res.redirect('/recovery');
                    } else {

                        // --
                        // Apply the password change
                        // --

                        user.password = crypto.createHash('sha1').update(req.body.password).digest('hex');

                        user.save(function(e) {
                            if (e) {
                                console.log('password_change applying change', e);
                                req.flash('error', 'There was a problem changing your password. Please try again later.');
                                res.redirect('/recovery');
                            } else {
                                ResetKeyStore.del('reset_key_' + req.body.key);

                                req.flash('success', 'Your password has been reset.');
                                res.redirect('/login');
                            }
                        });
                    }
                });
            }
        });
    } else {
        res.redirect('/recovery');
    }
}

// ------------------------
//   Process Registration
// ------------------------
exports.process_registration = function(req, res) {
    Async.waterfall([
        // --
        // Check required input data
        // --
        function(next) {
            if (req.body.email && req.body.password && req.body.first_name && req.body.last_name) {
                next();
            } else {
                next(new Error('Registration form incomplete'), 'warn');
            }
        },

        // --
        // Check if the email is already in use.
        // --
        function(next) {
            User.Find({ where: { email: req.body.email }}, next);
        },

        // --
        // Create new user.
        // --
        function(user, next) {
            if (!user) {
                User.Create({
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email: req.body.email,
                    password: req.body.password,
                    status: User.Status.VALIDATING
                }, next);
            } else {
                next(new Error('Sorry, that email address is already in use.'), 'error');
            }
        },

        // --
        // Create Confirmation Code
        // --
        function(user, next) {
            var ccode = user['@rid'] + '--nOlEt--' + user.email + '--NoLeT--' + user.handle;
            ccode = crypto.createHash('md5').update(ccode).digest("hex");
            ccode = crypto.createHash('sha256').update(ccode).digest("hex");
            var rid = RID.Encode(user['@rid']);
            ccode = rid.split('.')[0] + '_' + ccode + '_' + rid.split('.')[1];
            next(null, user, ccode);
        },

        // --
        // Send Confirmation Email
        // --
        function(user, ccode, next) {
            var job = Jobs.create('email_reg_email_confirmation', {
                title: 'Email: Email Confirmation',
                ccode: ccode,
                email: user.email,
                username: user.handle
            }).priority('high').save();

            job
                .on('complete', function() {
                    Util.log('Email Job Succeeded');
                })
                .on('failed', function(e) {
                    Util.log('Email Job Failed:', e);
                });

            next();
        }

    ], function(e, results) {
        if (e) {
            // Send em back to the registration form
            req.flash(results||'error', e.toString());
            res.redirect('/register');
        } else {
            // Registration complete
            var conf = Util._extend({}, Config);
            conf.theme = 'default';
            conf.hide_nav = true;
            conf.body_classes = ['login'];

            res.render('common/reg_confirmation', {
                config: conf,
                session: req.session,
                token: false,
                flash: req.flash(),
                title: 'Welcome to TinyNews.com',
                section: false,
                data: false
            });
        }
    });

}

// ------------------------
//   Email Confirmation
// ------------------------
exports.confirm_email = function(req, res) {
    Async.waterfall([
        // --
        // Check required input data
        // --
        function(next) {
            if (req.params.code) {
                var parts = req.params.code.split('_');
                var rid = '#' + parts[0] + ':' + parts[2];
                next(null, rid);
            } else {
                next(new Error('Your confirmation code is invalid.'), 'error');
            }
        },

        // --
        // Fetch the user's data
        // --
        function(rid, next) {
            User.Find({ where: { '@rid': rid }}, next);
        },

        // --
        // Validate confirmation code & status
        // --
        function(user, next) {
            var ccode = user['@rid'] + '--nOlEt--' + user.email + '--NoLeT--' + user.handle;
            ccode = crypto.createHash('md5').update(ccode).digest("hex");
            ccode = crypto.createHash('sha256').update(ccode).digest("hex");
            var rid = RID.Encode(user['@rid']);
            ccode = rid.split('.')[0] + '_' + ccode + '_' + rid.split('.')[1];

            if (req.params.code == ccode && user.status == User.Status.VALIDATING) {
                next(null, user);
            } else {
                next(new Error('Your confirmation code is invalid or you\'re already activated.'), 'error');
            }
        },

        // --
        // Update the users status
        // --
        function(user, next) {
            user.status = User.Status.ACTIVE;
            user.save(function(e) {
                if (e) {
                    next(new Error('There was a problem updating your account. Please contact support.'), 'error');
                } else {
                    next(null, user);
                }
            });
        },

        // --
        // Send welcome email
        // --
        function(user, next) {
            var job = Jobs.create('email_reg_send_welcome', {
                title: 'Email: Welcome Email',
                email: user.email
            }).priority('high').save();

            job
                .on('complete', function() {
                    Util.log('Email Job Succeeded');
                })
                .on('failed', function(e) {
                    console.log('job.on(failed)', e);
                    Util.log('Email Job Failed');
                });

            next();
        }
    ], function(e, results) {
        if (e) {
            // Send em back to the registration form
            console.log('RE: ', results, e);
            req.flash(results || 'error', e.toString());
            res.redirect('/register');
        } else {
            var conf = Util._extend({}, Config);
            conf.theme = 'default';
            conf.hide_nav = true;
            conf.body_classes = ['login'];

            res.render('common/confirm_email', {
                config: conf,
                session: req.session,
                token: false,
                flash: req.flash(),
                title: 'Welcome to TinyNews',
                section: false,
                data: false
            });
        }
    });
}

// ------------------------
//   Health Monitor
// ------------------------
exports.monitor = function(req, res) {
    res.render('common/monitor', {
        config: Config,
        session: {},
        token: false,
        flash: req.flash(),
        title: 'System Healthy',
        section: false,
        data: false
    });
}