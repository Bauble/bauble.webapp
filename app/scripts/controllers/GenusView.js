'use strict';

angular.module('BaubleApp')
    .controller('GenusViewCtrl', function ($scope, $location, globals, Genus) {
        $scope.genus = globals.selected;
        Genus.details(globals.selected, function(result) {
            $scope.genus = result.data;
        });

        $scope.$on('genus-edit', function(){
            $scope.$apply(function() {
                $location.path('/edit/genus');
            });
        });

        $scope.$on('genus-addtaxon', function(){
            $scope.$apply(function() {
                $location.path('/new/taxon').search({'genus': $scope.genus.ref});
            });
        });

        $scope.counts = {};

        Genus.count($scope.genus, "/taxa", function(result) {
            $scope.counts.taxa = result.data;
        });

        Genus.count($scope.genus, "/taxa/accessions", function(result) {
            $scope.counts.accessions = result.data;
        });

        Genus.count($scope.genus, "/taxa/accessions/plants", function(result) {
            $scope.counts.plants = result.data;
        });

    });
