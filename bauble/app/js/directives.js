'use strict';

/* Directives */

angular.module('BaubleApp.directives', [])
    .directive('appVersion', ['version', function(version) {
        return function(scope, elm, attrs) {
          elm.text(version);
        };
    }])

    .directive('emit', [function() {
        return {
            restrict: 'A',
            scope: true,
            link: function(scope, elm, attrs, controller) {
                elm.bind('click', function() {
                    scope.$emit(attrs.emit);
                });
            }
        };
    }]);