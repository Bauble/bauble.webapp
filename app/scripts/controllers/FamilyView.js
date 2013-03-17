'use strict';

angular.module('BaubleApp')
    .controller('FamilyViewCtrl', function ($scope, $location, Family) {

        $scope.family = {};
        $scope.Family = Family;

        // get the family details when the selection is changed
        //if($scope.selected) {
            $scope.$watch('selected', function() {
                $scope.Family.details($scope.selected, function(result) {
                    $scope.family = result.data;
                });
            });
        //}

        $scope.$on('family-edit', function(){
            $scope.$apply(function() {
                $location.path('/edit/family')
            });
        });
    });
