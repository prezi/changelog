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
        .controller('InputController', function ($scope, $location, ChangelogApi) {

            // Current URL -> Inputs
            function applyHash() {
                var state = $.bbq.getState();
                $scope.criticality = checkboxList(state.criticality ? state.criticality.split(',') : []);
                $scope.hoursAgo = parseInt(state.hours_ago, 10) || 1;
                $scope.until = parseInt(state.until, 10) || -1;
                $scope.category = checkboxList((state.category ? state.category.split(',') : []));
                $scope.description = state.description || '';
                $scope.isDashboard = parseInt(state.is_dashboard, 10) || 0;
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
            function buildPermalink(state) {
                var permalinkState = {}, prop;
                for (prop in state) {
                    if (state.hasOwnProperty(prop)) {
                        permalinkState[prop] = state[prop];
                        if (prop === 'until' && state.until === -1) {
                            permalinkState.until = moment().unix();
                        }
                    }
                }
                return $.param.fragment($location.absUrl(), permalinkState);
            }
            $scope.updateState = function (forceUpdate) {
                var newState = {},
                    state = $.bbq.getState(),
                    same = undefined,
                    // field name in the api -> field name in $scope
                    fields = {
                        criticality: same,
                        hours_ago: 'hoursAgo',
                        until: same,
                        category: same,
                        description: same,
                        is_dashboard: 'isDashboard'
                    },
                    field,
                    shouldUpdate = !!forceUpdate;
                function set(key, scopeKey) {
                    // Copy from $scope to newState if set, sorting and joining arrays
                    var value = $scope[scopeKey || key];
                    if (value === undefined || value.length === 0 || value === 0) { return; }
                    if (value instanceof Array) {
                        newState[key] = value.join(',');
                    } else {
                        newState[key] = value;
                    }
                }
                // Build hash describing current filters
                for (field in fields) {
                    if (fields.hasOwnProperty(field)) {
                        set(field, fields[field]);
                    }
                }
                function maybeParseInt(field, v) {
                    if (field === 'hours_ago' || field === 'until') {
                        return parseInt(v, 10);
                    }
                    return v;
                }
                // Check state for change
                for (field in fields) {
                    if (fields.hasOwnProperty(field)) {
                        var oldValue = maybeParseInt(field, state[field]),
                            newValue = maybeParseInt(field, newState[field]);
                        if (newValue !== oldValue) {
                            shouldUpdate = true;
                        }
                    }
                }

                if (shouldUpdate) {
                    // permalink should be down below in the $scope.$watch, but it fails to update the permalink
                    // when a field is removed
                    $scope.permalink = buildPermalink(newState);
                    // state changed, return the new one
                    return newState;
                }
                // No changes, return the original state
                return state;
            };
            $scope.$watch(
                'updateState()',
                function (state) {
                    $.bbq.pushState(state, 2);
                    ChangelogApi.fetch(state);
                },
                true
            );

            // Initial load from hash when loading the page
            applyHash();
            $scope.updateState(true);

            // Checkboxes -> list
            checkboxList($scope.criticality);
            checkboxList($scope.category);

            // Time-range - radiobutton
            // buttons -> (until, hoursAgo)
            $scope.timerangeRadio = null;
            $scope.$watch('timerangeRadio', function (value) {
                if (!value) { return; }
                var parts = value.split(':');
                if (parts[0] === 'last') {
                    $scope.until = -1;
                    $scope.hoursAgo = moment.duration(parseInt(parts[1], 10), parts[2]).asHours();
                } else {
                    if ($scope.until === -1) {
                        $scope.until = moment().unix();
                    }
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
        })

        .controller('EventListController', function ($scope, ChangelogApi) {
            $scope.loading = false;
            ChangelogApi.loading(function () { $scope.loading = true; });
            ChangelogApi.success(function (events) {
                $scope.events = events;
                $scope.loading = false;
            });
        })

        .controller('AutorefreshController', function ($scope, $interval, ChangelogApi) {
            var refreshInterval = 10000,
                stepGranularity = 100,
                elapsed = 0,
                intervalId;
            $scope.percent = 0;
            intervalId = $interval(function () {
                elapsed += stepGranularity;
                $scope.percent = (elapsed / refreshInterval) * 100;
                if (elapsed >= refreshInterval) {
                    if ($scope.isDashboard) {
                        ChangelogApi.fetch($.bbq.getState());
                    }
                    elapsed = 0;
                    $scope.percent = 0;
                }
            }, stepGranularity);
        });
}());
