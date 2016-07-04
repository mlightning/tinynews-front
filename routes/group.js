'use strict';

// ----------------
//   Dependencies
// ----------------
var async                       = require('async');
var Config                      = require('../config.json');
var Util                        = require('util');
var Core                        = require('tinynews-common');

// Models
var User                        = Core.Models.User;
var Group                       = Core.Models.Group;
// ---------------------
//   View User Profile
// ---------------------

exports.view_profile = function(req,res,next) {
    Group.Find({ where: { slug: req.params.slug }}, function(e, results) {
        if (e || !results) {
            next();
        } else {
            async.parallel({
                group_members:function(callback){
                    results.get_members(callback);
                },
                group_moderators:function(callback){
                    results.get_moderators(callback);
                },
                recently_rated:function(callback){
                    results.get_recently_rated(callback);
                }
            },function(err,groupData){
                results.members = groupData.group_members;
                results.moderators = groupData.group_moderators;
                results.recently_reviewed = groupData.recently_rated;
                results.recently_reviewed_count = groupData.recently_rated.length;
                res.render('group/view_profile', {
                    config: Config,
                    session: req.session,
                    token: req.token,
                    flash: req.flash(),
                    title: results.name + '\'s Profile',
                    section: 'group',
                    data: {
                        group:results
                    }
                });

            });
        }
    });

}


// ---------------------
//   Create group
// ---------------------
exports.create = function(req, res) {

    res.render('group/create', {
        config: Config,
        session: req.session,
        token: req.token || false,
        flash: req.flash(),
        title: 'Create Group',
        section: 'group',
        data: false
    });

}

