'use strict';

angular.module('BaubleApp')
    .controller('LocationViewCtrl', function ($scope, $location, globals, Location) {
        $scope.location = globals.getSelected();

        $scope.$on('location-edit', function(){
            $scope.$apply(function() {
                $location.path('/edit/location');
            });
        });

        $scope.counts = {};
        Location.count($scope.location, "/plants", function(result) {
            $scope.counts.plants = result.data;
        });
    });
