'use strict';

angular.module('BaubleApp')
    .controller('TaxonViewCtrl', function ($scope, $location, globals, Taxon) {
        $scope.taxon = globals.selected;
        Taxon.details(globals.selected, function(result) {
            $scope.taxon = result.data;
        });

        $scope.$on('taxon-edit', function(){
            $scope.$apply(function() {
                $location.path('/edit/taxon');
            });
        });

        $scope.$on('taxon-addaccession', function(){
            $scope.$apply(function() {
                $location.path('/new/accession').search({'taxon': $scope.taxon.ref});
            });
        });

        $scope.counts = {};

        Taxon.count($scope.taxon, "/accessions", function(result) {
            $scope.counts.accessions = result.data;
        });

        Taxon.count($scope.taxon, "/accessions/plants", function(result) {
            $scope.counts.plants = result.data;
        });
    });
