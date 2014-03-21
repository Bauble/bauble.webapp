'use strict';

angular.module('BaubleApp')
    .controller('PlantViewCtrl', function ($scope, $location, Alert, Plant) {

        $scope.plant = $scope.selected;

        Plant.get($scope.plant, {embed: ['location']})
            .success(function(data, status, headers, config) {
                $scope.plant = data;
                console.log('$scope.plant: ', $scope.plant);
            })
            .error(function(data, status, headers, config) {
                var defaultMessage = "Could not get plant details.";
                Alert.onErrorResponse(data, defaultMessage);
            });
    });
