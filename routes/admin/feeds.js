'use strict';

// ----------------
//   Dependencies
// ----------------

var Config                      = require('../../config.json');
var Util                        = require('util');
var Core                        = require('tinynews-common');

// --------------------------
//   View Publisher Profile
// --------------------------
exports.manage = function(req, res) {
    if (req.token.user.permissions['article.edit']) {
        res.render('admin/manage_subscriptions', {
            config: Config,
            session: req.session,
            token: req.token || false,
            flash: req.flash(),
            title: 'Manage Feed System Subscriptions',
            section: 'admin',
            data: {}
        });
    }
}

