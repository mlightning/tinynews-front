// ----------------
//   Dependencies
// ----------------

var Config          = require('../config.json');
var ElasticSearch   = require('elasticsearch');

// Shared Core
var Core                        = require('tinynews-common');

// Models
var Article                     = Core.Models.Article;

// Connect to ElasticSearch
var ES = ElasticSearch.Client({
    host: Core.Config.elastic.host + ':' + Core.Config.elastic.port,
    sniffOnStart: Core.Config.elastic.startup_sniff,
    sniffInterval: Core.Config.elastic.sniff_frequency
});

// -----------------
//   Home
// -----------------
exports.index = function(req, res) {

    //Article.FindRecent({}, function(errors, articles) {
    //    if (errors) {
    //        console.log(errors);
    //    }

        res.render('home/index', {
            config: Config,
            session: req.session,
            token: req.token || false,
            flash: req.flash(),
            title: 'Homepage',
            section: 'home',
            data: false
        });
    //});

}

// -----------------
//   About Us
// -----------------
exports.about = function(req, res) {
    res.render('home/about', {
        config: Config,
        session: req.session,
        token: req.token || false,
        flash: req.flash(),
        title: 'About TinyNews.com',
        section: false,
        data: false
    });
}

// -----------------
//   Privacy
// -----------------
exports.privacy = function(req, res) {
    res.render('home/privacy', {
        config: Config,
        session: req.session,
        token: req.token || false,
        flash: req.flash(),
        title: 'Our Privacy Policy',
        section: false,
        data: false
    });
}

//-----------------
//About Our Ratings
//-----------------
exports.about_our_ratings = function(req, res) {
    res.render('home/about_our_ratings', {
        config: Config,
        session: req.session,
        token: req.token || false,
        flash: req.flash(),
        title: 'About Our Ratings',
        section: false,
        data: false
    });
}

// -----------------
//   Contact Us
// -----------------
exports.contact = function(req, res) {
    res.render('home/contact', {
        config: Config,
        session: req.session,
        token: req.token || false,
        flash: req.flash(),
        title: 'Contact TinyNews',
        section: false,
        data: false
    });
}

// -----------------
//   FAQ
// -----------------
exports.faq = function(req, res) {
    res.render('home/faq', {
        config: Config,
        session: req.session,
        token: req.token || false,
        flash: req.flash(),
        title: 'Frequently Asked Questions',
        section: false,
        data: false
    });
}

// --------------------
//   Terms of Service
// --------------------
exports.terms = function(req, res) {
    res.render('home/terms', {
        config: Config,
        session: req.session,
        token: req.token || false,
        flash: req.flash(),
        title: 'Terms of Service',
        section: false,
        data: false
    });
}

// --------------------
//   Global Search
// --------------------
exports.search = function(req, res) {
    if (req.query.query) {

        var pageNum = 1;
        var perPage = 25;

        ES.search({
            index: Core.Config.elastic.index,
            from: (pageNum - 1) * perPage,
            size: perPage,
            q: req.query.query
        }, function (error, response) {
            if (error) {
                console.log(err, err.stack);
                req.flash('error', 'There was a problem processing your search.');
            }

            res.render('home/search', {
                config: Config,
                session: req.session,
                token: req.token || false,
                flash: req.flash(),
                title: 'Search Results',
                section: false,
                data: {
                    search: response,
                    query: req.query.query
                }
            });
        });
    } else {
        res.render('home/search', {
            config: Config,
            session: req.session,
            token: req.token || false,
            flash: req.flash(),
            title: 'Search',
            section: false,
            data: false
        });
    }
}
