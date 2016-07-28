'use strict';

// ----------------
//   Dependencies
// ----------------

var Config                      = require('../../config.json');
var Util                        = require('util');
var Core                        = require('tinynews-common');

// --------------------------
//   View Users List
// --------------------------
exports.manage = function(req, res) {
    if (req.token.user.permissions['user.admin']) {
        res.render('admin/manage_users', {
            config: Config,
            session: req.session,
            token: req.token || false,
            flash: req.flash(),
            title: 'Manage Users',
            section: 'admin',
            data: {}
        });
    } else {
        res.redirect('/404');
    }
}

