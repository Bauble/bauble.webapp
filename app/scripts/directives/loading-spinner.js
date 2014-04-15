'use strict';

angular.module('BaubleApp')
    .directive('loadingSpinner', function () {
        return {
            template: '<i class="fa fa-spin fa-spinner" ng-hide="loaded"></i><span ng-transclude></span>',
            transclude: true,
            scope: {
                loadingSpinner: '='
            },
            restrict: 'A',
            link: function(scope, element, attrs) {
                scope.$watch('loadingSpinner', function(loading) {
                    scope.loaded = angular.isDefined(loading) && loading !== null;
                });
            }
        };
    });
