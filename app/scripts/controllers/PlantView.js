'use strict';

angular.module('BaubleApp')
    .controller('PlantViewCtrl', function ($scope, $location, Plant) {
        $scope.Plant = Plant;
        $scope.plant = {};

        // get the taxon details when the selection is changed
        $scope.$watch('selected', function() {
            $scope.Plant.details($scope.selected, function(result) {
                $scope.plant = result.data;
            });
        });

        $scope.$on('plant-edit', function(){
            $scope.$apply(function() {
                $location.path('/edit/plant')
            });
        });
    });
