'use strict';

describe('UserProfileController', function() {

    // --
    // Suite Setup
    // --

    beforeEach(angular.mock.module('TinyNewsApp'));

    // --
    // Tests
    // --

    it('UserProfileController should exist', function() {

        for (var i in TinyNewsApp) {
            dump('TinyNewsApp.' + i + ' ::');
            dump(TinyNewsApp[i]);
        }

        TinyNewsApp.should.not.be.null;

        Alerts.should.not.be.null;
    });

    // --
    // Suite Teardown
    // --

    // ~~

});