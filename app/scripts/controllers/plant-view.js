'use strict';

angular.module('BaubleApp')
    .controller('PlantViewCtrl', function ($scope, $location, globals, Plant) {

        $scope.plant = globals.getSelected();

        Plant.get($scope.plant, function(result) {
            $scope.plant = result.data;
        });

        $scope.$on('plant-edit', function(){
            $scope.$apply(function() {
                $location.path('/edit/plant');
            });
        });
    });
