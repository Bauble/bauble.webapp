'use strict';

angular.module('BaubleApp')
    .controller('FamilyViewCtrl', function ($scope, $location, globals, Family) {

        $scope.family = globals.selected;
        Family.details($scope.family)
            .success(function(data, status, headers, config) {
                $scope.family = data;
            })
            .error(function(data, status, headers, config) {
                // do something
            });

        $scope.$on('family-edit', function(){
            $scope.$apply(function() {
                $location.path('/edit/family');
            });
        });

        $scope.$on('family-addgenus', function(){
            $scope.$apply(function() {
                $location.path('/new/genus').search({'family': $scope.family.ref});
            });
        });

        $scope.counts = {};
        Family.count($scope.family, "/genera")
            .success(function(data, status, headers, config) {
                $scope.counts.genera = data;
            })
            .error(function(data, status, headers, config) {
                // do something
            });

        Family.count($scope.family, "/genera/taxa")
            .success(function(data, status, headers, config) {
                $scope.counts.taxa = data;
            })
            .error(function(data, status, headers, config) {
                // do something
            });

        Family.count($scope.family, "/genera/taxa/accessions")
            .success(function(data, status, headers, config) {
                $scope.counts.accessions = data;
            })
            .error(function(data, status, headers, config) {
                // do something
            });

        Family.count($scope.family, "/genera/taxa/accessions/plants")
            .success(function(data, status, headers, config) {
                $scope.counts.plants = data;
            })
            .error(function(data, status, headers, config) {
                // do something
            })
        });
