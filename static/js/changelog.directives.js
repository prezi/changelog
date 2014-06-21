/*globals angular*/
(function () {
    'use strict';
    angular.module('changelog.directives', [])
        .directive('ngDebounce', function($timeout) {
            // http://tommaitland.net/2013/11/debounced-delayed-throttled-model-updates-angular-1-2/
            return {
                restrict: 'A',
                require: 'ngModel',
                priority: 99,
                link: function(scope, elm, attr, ngModelCtrl) {
                    if (attr.type === 'radio' || attr.type === 'checkbox') return;
                    elm.unbind('input');
                    var debounce;
                    elm.bind('input', function() {
                        $timeout.cancel(debounce);
                        debounce = $timeout( function() {
                            scope.$apply(function() {
                                ngModelCtrl.$setViewValue(elm.val());
                            });
                        }, attr.ngDebounce || 500);
                    });
                    elm.bind('blur', function() {
                        scope.$apply(function() {
                            ngModelCtrl.$setViewValue(elm.val());
                        });
                    });
                }
            }
        });
}());
