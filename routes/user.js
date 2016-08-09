'use strict';

// ----------------
//   Dependencies
// ----------------

var Config                      = require('../config.json');
var Util                        = require('util');
var Core                        = require('tinynews-common');
var Async                       = require('async');

// Models
var User                        = Core.Models.User;

// ---------------------
//   View User Profile
// ---------------------
exports.view_profile = function(req, res) {
    // No profile specified and no login to use
    if (!req.params.user_id && req.token) {
        var where = { '@rid': req.token.user['@rid'] };
        var section = 'profile';
    } else if (!req.params.user_id && !req.token) {
        res.redirect('/404');
    } else {
        var where = { 'handle': req.params.user_id };
        var section = false;
    }

    // TODO: The following data needs to be cached

    User.Find({ where: where }, function(e, user) {
        if (e) {
            Util.log(e);
            return res.redirect('/404');
        }

        Async.parallel({
            profile: function(done) {
                user.fetch_profile(done);
            },
            friend_count: function(done) {
                user.get_friend_count(function(e, count) {
                    user.friend_count = count;
                    done(e, count);
                });
            },
            group_count: function(done) {
                user.get_group_count(function(e, count) {
                    user.group_count = count;
                    done(e, count);
                });
            },
            follower_count: function(done) {
                user.get_follower_count(function(e, count) {
                    user.follower_count = count;
                    done(e, count);
                });
            },
            followed_count: function(done) {
                user.get_followed_count(function(e, count) {
                    user.followed_count = count;
                    done(e, count);
                });
            },
            avg_rating: function(done) {
                user.get_avg_rating(function(e, rating) {
                    user.avg_rating = rating;
                    done(e, rating);
                });
            },
            rated_article_count: function(done) {
                user.get_rated_article_count(function(e, count) {
                    user.rated_article_count = count;
                    done(e, count);
                });
            },
            recently_rated_articles: function(done) {
                user.get_recently_rated_by_user(function(e, articles) {
                    user.recently_rated_articles = articles;
                    done(e, articles);
                });
            }
        }, function(errors, results) {
            try {
                res.render('user/view_profile', {
                    config: Config,
                    session: req.session,
                    token: req.token || false,
                    flash: req.flash(),
                    title: user.first_name + ' ' + user.last_name + '\'s Profile',
                    section: section,
                    data: {
                        user: user,
                        profile: results.profile || {}
                    }
                });
            }
            catch(e) {
                console.log(e);
            }
        });

    });
}

// ---------------------
//   Manage Feed
// ---------------------
exports.manage_feed = function(req, res) {
    User.Find({ where: { '@rid': req.token.user['@rid'] }}, function(e, user) {
        if (e) {
            Util.log(e);
            return res.redirect('/404');
        }

        delete user.password;
        delete user.permissions;

        user.get_feed_settings(function(err, settings) {
            if (err) {
                Util.log(err);
                return res.redirect('/404');
            }

            res.render('user/manage_feed', {
                config: Config,
                session: req.session,
                token: req.token || false,
                flash: req.flash(),
                title: 'Manage Your Feed',
                section: 'profile',
                data: {
                    user: user,
                    settings: (settings) ? settings : {}
                }
            });
        });
    });

}

// ---------------------
//   Change Password
// ---------------------
exports.account_settings = function(req, res) {
    User.Find({ where: { '@rid': req.token.user['@rid'] }}, function (e, user) {
        if (e) {
            Util.log(e);
            return res.redirect('/404');
        }

        delete user.password;
        delete user.permissions;

        Async.parallel({
            profile: function(done) {
                user.fetch_profile(function(e, profile) {
                    user.profile = profile;
                    done();
                });
            }
        }, function(errors, resp) {
            if (errors) {
                Util.log(errors);
                return res.redirect('/404');
            }

            res.render('user/account_settings', {
                config: Config,
                session: req.session,
                token: req.token || false,
                flash: req.flash(),
                title: 'Account Settings',
                section: 'profile',
                data: {
                    user: user
                }
            });
        });
    });
}