'use strict';

angular.module('BaubleApp')
    .controller('TaxonViewCtrl', function ($scope, $location, Taxon) {
        $scope.Taxon = Taxon;
        $scope.taxon = {};

        // get the taxon details when the selection is changed
        $scope.$watch('selected', function() {
            $scope.Taxon.details($scope.selected, function(result) {
                $scope.taxon = result.data;
            });
        });

        $scope.$on('taxon-edit', function(){
            $scope.$apply(function() {
                $location.path('/edit/taxon')
            });
        });
    });
