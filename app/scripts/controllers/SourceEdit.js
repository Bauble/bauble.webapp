'use strict';

angular.module('BaubleApp')
    .controller('SourceEditCtrl', function ($scope) {
        $scope.source = {};

        $scope.modalOptions = {
            backdropFade: true,
            dialogFade:true
        };

        $scope.close = function() {
            console.log('close()');
            $scope.showSourceEditor = false;
        };

        $scope.save = function() {
            console.log('save()');
        };
    });
