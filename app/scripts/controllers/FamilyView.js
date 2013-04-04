'use strict';

angular.module('BaubleApp')
    .controller('FamilyViewCtrl', function ($scope, $location, globals, Family) {

        $scope.family = globals.selected;
        Family.details(globals.selected, function(result) {
            $scope.family = result.data;
        });

        $scope.$on('family-edit', function(){
            $scope.$apply(function() {
                $location.path('/edit/family')
            });
        });

        $scope.$on('family-addgenus', function(){
            $scope.$apply(function() {
                $location.path('/new/genus').search({'family': $scope.family.ref});
            });
        });

        $scope.counts = {};
        Family.count($scope.family, "/genera", function(result) {
            $scope.counts.genera = result.data
        })

        Family.count($scope.family, "/genera/taxa", function(result) {
            $scope.counts.taxa = result.data
        })

        Family.count($scope.family, "/genera/taxa/accessions", function(result) {
            $scope.counts.accessions = result.data
        })

        Family.count($scope.family, "/genera/taxa/accessions/plants", function(result) {
            $scope.counts.plants = result.data
        })
    });
