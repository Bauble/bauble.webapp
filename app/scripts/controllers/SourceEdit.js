'use strict';

angular.module('BaubleApp')
    .controller('SourceEditCtrl', function ($scope, $modalInstance) {
        $scope.source = {};

        $scope.close = function() {
            console.log('close()');
            $scope.showSourceEditor = false;
            $modalInstance.close()
        };

        $scope.save = function() {
            // TODO: validate and save
            $modalInstance.close()
            console.log('save()');
        };
    });
