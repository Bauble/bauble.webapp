'use strict';

angular.module('BaubleApp')
    .controller('NewCtrl', function ($scope, $routeParams, ViewMeta) {
        $scope.editor = ViewMeta[$routeParams.resource].editor;
    });
