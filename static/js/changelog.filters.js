/*globals angular*/
(function () {
    'use strict';
    angular.module('changelog.filters', [])
        .filter('unsafeHtml', function ($sce) {
            return function (html) {
                return $sce.trustAsHtml(html);
            };
        });
}());
