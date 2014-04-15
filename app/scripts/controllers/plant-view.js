'use strict';

angular.module('BaubleApp')
    .controller('PlantViewCtrl', function ($scope, $location, Alert, Plant, DeleteModal) {

        $scope.plant = null;

        $scope.$watch('selected', function(selected) {
            $scope.plant = $scope.selected;

            Plant.get($scope.plant, {embed: ['location', 'accession']})
                .success(function(data, status, headers, config) {
                    $scope.plant = data;
                })
                .error(function(data, status, headers, config) {
                    var defaultMessage = "Could not get plant details.";
                    Alert.onErrorResponse(data, defaultMessage);
                });
        });


        $scope.delete = function() {
            DeleteModal(Plant, $scope.plant)
                .catch(function(result){
                    var defaultMessage = 'Could not get delete plant.';
                    Alert.onErrorResponse(result.data, defaultMessage);
                });
        };
    });
