'use strict';

// ----------------
//   Dependencies
// ----------------

var Config                      = require('../config.json');
var Util                        = require('util');
var Core                        = require('tinynews-common');
var Async                       = require('async');

// Models
var Journalist                  = Core.Models.Journalist;

// ---------------------------
//   View Journalist Profile
// ---------------------------
exports.view_profile = function(req, res, next) {
    Journalist.Find({ where: { slug: req.params.slug }}, function(e, journalist) {
        if (e || !journalist) {
            next();
        } else {

            Async.parallel({
                avg_rating: function(done) {
                    journalist.get_avg_rating_user(done);
                },
                articles: function(done) {
                    journalist.get_articles(done);
                },
                publishers: function(done) {
                    journalist.get_publishers(done);
                },
                follower_count: function(done) {
                    journalist.get_follower_count(done);
                }
            }, function(e, results) {
                if (e || !results) {
                    next();
                } else {

                    results.publisher_count = results.publishers.length;

                    res.render('journalist/view_profile', {
                        config: Config,
                        session: req.session,
                        token: req.token || false,
                        flash: req.flash(),
                        title: journalist.first_name + ' ' + journalist.last_name + '\'s Profile',
                        section: 'journalist',
                        data: {
                            journalist: journalist,
                            meta: results
                        }
                    });
                }
            });
        }
    });
}

// ---------------------------
//   List/Browse Journalists
// ---------------------------
exports.list = function(req, res, next) {
    Journalist.FindAll({ }, function(e, journalists) {
        if (e || !journalists)  {
            next();
        } else {
            res.render('journalist/list', {
                config: Config,
                session: req.session,
                token: req.token || false,
                flash: req.flash(),
                title: 'Browse Journalists',
                section: 'journalist',
                data: {
                    journalists: journalists
                }
            });
        }
    });
}