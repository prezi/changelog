/*globals angular, $, moment*/
(function () {
    'use strict';

    function checkboxList(list) {
        list.isChecked = function (item) {
            return list.indexOf(item) > -1;
        };
        list.toggle = function (item) {
            var idx = list.indexOf(item);
            if (idx > -1) {
                list.splice(idx, 1);
            } else {
                list.push(item);
            }
        };
        list.clear = function () {
            list.splice(0, list.length);
        };
        return list;
    }

    angular.module('changelog.controllers', [])
        .controller('InputController', function ($scope, $location) {

            // Current URL -> Inputs
            function applyHash() {
                var state = $.bbq.getState();
                $scope.criticalities = checkboxList(state.criticality ? state.criticality.split(',') : []);
                $scope.hoursAgo = parseInt(state.hours_ago, 10) || 1;
                $scope.until = parseInt(state.until, 10) || -1;
                $scope.categories = checkboxList((state.categories ? state.categories.split(',') : []));
                $scope.description = state.description || '';
                if ($scope.until === -1) {
                    // ng-repeat doesn't work inside bs-radio-group, so we need to do generate the list with Jinja
                    // and do this manually
                    $scope.timerangeRadio = $('.timerange-relative').filter(function () {
                        var parts = this.value.split(':');
                        return moment.duration(parseInt(parts[1], 10), parts[2]).asHours() === $scope.hoursAgo;
                    }).val();
                } else {
                    $scope.timerangeRadio = 'fixed';
                }
            }
            $scope.$watch(function () { return $.bbq.getState(); }, applyHash, true);

            // Inputs -> Current URL
            $scope.updateState = function () {
                var newData = {
                    criticality: $scope.criticalities.sort().join(','),
                    hours_ago: $scope.hoursAgo,
                    until: $scope.until,
                    categories: $scope.categories.sort().join(','),
                    description: $scope.description
                }, state = $.bbq.getState(), prop;
                for (prop in newData) {
                    if (newData.hasOwnProperty(prop)) {
                        if (newData[prop] !== state[prop]) {
                            return newData;
                        }
                    }
                }
                return $scope.state;
            };
            $scope.$watch(
                'updateState()',
                function (state) {
                    $.bbq.pushState(state);
                    if (state.until === -1) { state.until = moment().unix(); }
                    $scope.permalink = $.param.fragment($location.absUrl(), state);
                },
                true
            );

            // Initial load from hash when loading the page
            applyHash();

            // Checkboxes -> list
            checkboxList($scope.criticalities);
            checkboxList($scope.categories);

            // Time-range - radiobutton
            // buttons -> (until, hoursAgo)
            $scope.timerangeRadio = null;
            $scope.until = $.bbq.getState('until') || -1;
            $scope.hoursAgo = $.bbq.getState('hours_ago') || 1;
            $scope.$watch('timerangeRadio', function (value) {
                if (!value) { return; }
                var parts = value.split(':');
                if (parts[0] === 'last') {
                    $scope.until = -1;
                    $scope.hoursAgo = moment.duration(parseInt(parts[1], 10), parts[2]).asHours();
                } else {
                    $scope.until = moment().unix();
                }
            });

            // Time-range - bookkeeping
            // (until, hoursAgo) -> (fromDate, toDate)
            $scope.$watchCollection('[hoursAgo, until]', function (xs) {
                var hoursAgo = xs[0], until = xs[1];
                $scope.toDate = moment.unix(until).toDate();
                $scope.fromDate = moment($scope.toDate).subtract(hoursAgo, 'hours').toDate();
            });
            // (fromDate, toDate) -> (until, hoursAgo)
            $scope.$watch('fromDate', function (fromDate) { $scope.hoursAgo = moment($scope.toDate).diff(fromDate, 'hours'); });
            $scope.$watch('toDate', function (toDate) { $scope.until = moment(toDate).unix(); });
        });
}());
