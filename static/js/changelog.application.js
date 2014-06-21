/*globals angular*/
(function () {
    'use strict';
    angular
        .module('changelog.application', ['mgcrea.ngStrap',
            'changelog.controllers', 'changelog.services', 'changelog.directives'])
        .config(function ($locationProvider) {
            $locationProvider.html5Mode(true);
            $locationProvider.hashPrefix('#');
        });
}());
