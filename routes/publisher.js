'use strict';

// ----------------
//   Dependencies
// ----------------

var Config                      = require('../config.json');
var Util                        = require('util');
var Core                        = require('tinynews-common');
var Async                       = require('async');
// Models
var Publisher                   = Core.Models.Publisher;

// --------------------------
//   View Publisher Profile
// --------------------------
exports.view_profile = function(req, res, next) {
    Publisher.Find({ where: { slug: req.params.slug }}, function(e, publisher) {
        if (e || !publisher) {
            next();
        } else {
            Async.parallel({
                articles: function(done) {
                    publisher.get_articles(done);
                },
                articles_count: function(done) {
                    publisher.get_article_count(done);
                },
                follower_count: function(done) {
                    publisher.get_follower_count(done);
                },
                avg_rating_user: function(done) {
                    publisher.get_avg_rating_user(done);
                },
                journalists: function(done) {
                    publisher.get_journalists(done);
                }
            }, function(errors, results) {
                if (errors) {
                    next();
                } else {
                    res.render('publisher/view_profile', {
                        config: Config,
                        session: req.session,
                        token: req.token || false,
                        flash: req.flash(),
                        title: publisher.name + '\'s Profile',
                        section: 'publisher',
                        data: {
                            publisher: publisher,
                            meta: results
                        }
                    });
                }
            });
        }
    });
}

// ---------------------------
//   List/Browse Publishers
// ---------------------------
exports.list = function(req, res, next) {
    Publisher.FindAll({ }, function(e, publishers) {
        if (e || !publishers) {
            next();
        } else {
            res.render('publisher/list', {
                config: Config,
                session: req.session,
                token: req.token || false,
                flash: req.flash(),
                title: 'Browse Publishers',
                section: 'publisher',
                data: {
                    publishers: publishers
                }
            });
        }
    });
}
