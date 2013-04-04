'use strict';

angular.module('BaubleApp')
    .controller('PlantViewCtrl', function ($scope, $location, globals, Plant) {
        $scope.plant = globals.selected;
        Plant.details(globals.selected, function(result) {
            $scope.plant = result.data;
        });

        $scope.$on('plant-edit', function(){
            $scope.$apply(function() {
                $location.path('/edit/plant')
            });
        });
    });
