'use strict';

describe('Midway: Module Verification >', function() {

    var module;
    var test = it;

    // --
    // Pre Test Setup
    // --

    before(function() {
        module = angular.module('TinyNewsApp');
    });

    // --
    // Tests
    // --

    test('TinyNewsApp Module should be registered', function() {
        module.should.not.equal(null);
    });

    describe('Dependencies:', function() {

        var deps;
        var has_module = function(m) {
            return deps.indexOf(m) >= 0;
        }

        before(function() {
            deps = module.value('appName').requires;
        });

        test('Sanity: Should not have NyanCat as dependency', function() {
            has_module('NyanCat').should.not.be.ok;
        });

        test('Should have TinyNewsApp.Controllers as dependency', function() {
            has_module('TinyNewsApp.Controllers').should.be.ok;
        });

        test('Should have TinyNewsApp.Directives as dependency', function() {
            has_module('TinyNewsApp.Directives').should.be.ok;
        });

        test('Should have TinyNewsApp.Services as dependency', function() {
            has_module('TinyNewsApp.Services').should.be.ok;
        });

        test('Should have TinyNewsApp.Models as dependency', function() {
            has_module('TinyNewsApp.Models').should.be.ok;
        });

        test('Should have CommonModels as dependency', function() {
            has_module('CommonModels').should.be.ok;
        });

    });

    // --
    // Post Test Teardown
    // --

    after(function() {

    });

});