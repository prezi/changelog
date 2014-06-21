/*globals angular*/
(function () {
    'use strict';
    angular.module('changelog.services', [])
        .factory('ChangelogApi', function ($http, $rootScope) {
            var url = '/api/events',
                loading = 'api:events:loading',
                success = 'api:events:success';
            return {
                fetch: function (filters) {
                    $rootScope.$broadcast(loading);
                    return $http.get(url, {
                        params: filters
                    }).success(function (json) {
                        $rootScope.$broadcast(success, json);
                    });
                },
                loading: function (cb) { $rootScope.$on(loading, cb); },
                success: function (cb) {
                    $rootScope.$on(success, function (e, json) {
                        cb(json);
                    });
                }
            };
        });
}());
