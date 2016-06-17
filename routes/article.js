'use strict';

// ----------------
//   Dependencies
// ----------------

var Config                      = require('../config.json');
var Util                        = require('util');
var Core                        = require('tinynews-common');
var Async                       = require('async');

// Models
var Article                     = Core.Models.Article;

// ---------------------------
//   View Article
// ---------------------------
exports.view = function(req, res) {
    Article.Find({ where: { slug: req.params.slug }}, function(e, article) {
        if (e || !article) {
            next();
        } else {
            article.fetch_meta(function(e) {
                if (e) {
                    article.facts = [];
                    article.statements = [];
                }
                article.get_tags(function(e, tags) {
                    if(tags) {
                        article.tags=tags;
                    }

                    var template = 'article/view_article';
                    res.render(template, {
                        config: Config,
                        session: req.session,
                        token: req.token || false,
                        flash: req.flash(),
                        plugins_js: ["ion.rangeslider/js/ion-rangeSlider/ion.rangeSlider.min.js"],
                        plugins_css: ["ion.rangeslider/css/ion.rangeSlider.Metronic.css", "ion.rangeslider/css/ion.rangeSlider.css"],
                        title: 'Article - ' + article.title,
                        section: 'article',
                        data: {
                            article: article,
                            user_perm: req.token.user.permissions
                        }
                    })
                });
            });
        }
    });
}

/**
 * --------------------
 * Editor's Choice
 * --------------------
 */

exports.editors_choice = function(req, res) {

    res.render('article/editor_choice', {
            config: Config,
            session: req.session,
            token: req.token || false,
            flash: req.flash(),
            title: 'Editor\'s choice',
            section: 'article',
            data: {

            }
        });
};

/**
 * --------------------
 * Editor Only Routes
 * --------------------
 */

// ---------------------------
//   Manage Article
// ---------------------------
exports.editor = function(req, res, next) {
    if (req.token.user.permissions['article.edit']) {
        Article.Find({ where: { slug: req.params.slug }}, function(e, article) {
            if (e || !article) {
                next();
            } else {
                article.fetch_meta(function(e) {
                    if (e) {
                        article.facts = [];
                        article.statements = [];
                    }
                    res.render('article/editor_manage_article', {
                        config: Config,
                        session: req.session,
                        token: req.token || false,
                        flash: req.flash(),
                        title: 'Manage Article',
                        section: 'article',
                        data: {
                            article: article
                        }
                    });
                });
            }
        });
    } else {
        next();
    }
}