'use strict';

angular.module('BaubleApp')
    .controller('EditCtrl', function ($scope, $routeParams, ViewMeta) {
        $scope.editor = ViewMeta[$routeParams.resource].editor;
    });
