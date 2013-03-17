'use strict';

angular.module('BaubleApp')
    .controller('LocationViewCtrl', function ($scope, Location) {
        $scope.Location = Location;
        $scope.location = {};

        // get the taxon details when the selection is changed
        $scope.$watch('selected', function() {
            $scope.Location.details($scope.selected, function(result) {
                $scope.location = result.data;
            });
        });


        $scope.$on('location-edit', function(){
            $scope.$apply(function() {
                $location.path('/edit/location')
            });
        });
    });
