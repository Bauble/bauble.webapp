'use strict';

angular.module('BaubleApp')
    .controller('PlantViewCtrl', function ($scope, Plant) {
        $scope.Plant = Plant;
        $scope.plant = {};

        // get the taxon details when the selection is changed
        $scope.$watch('selected', function() {
            $scope.Plant.details($scope.selected, function(result) {
                $scope.plant = result.data;
            });
        });

        $scope.onEditorLoaded = function() {
            // remove the template after the dialog is hidden
            console.log('onEditorLoaded');
            var el = $('#plantEditorContainer div').first();
            el.on('hide', function() {
                $scope.editorTemplate = false;
                //$scope.showEditor = false;
                $scope.testShow = false;

            });
        };

        $scope.$on('plant-edit', function(){
            $scope.editorTemplate = $scope.viewMeta['editor'];
            // set this in apply since we're in an event "outside" of angular
            $scope.$apply('showEditor = true');
        });
    });
