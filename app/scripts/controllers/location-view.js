'use strict';

angular.module('BaubleApp')
  .controller('LocationViewCtrl', ['$scope', '$location', 'Location',
    function ($scope, $location, Location) {
        $scope.location = $scope.selected;

        $scope.$on('location-edit', function(){
            $scope.$apply(function() {
                $location.path('/edit/location');
            });
        });

        $scope.counts = {};
        Location.count($scope.location, "/plants", function(result) {
            $scope.counts.plants = result.data;
        });
    }]);
