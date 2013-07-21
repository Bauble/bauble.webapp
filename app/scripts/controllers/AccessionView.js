'use strict';

angular.module('BaubleApp')
    .controller('AccessionViewCtrl', function ($scope, $location, globals, Accession) {
        $scope.accession = globals.selected;
        Accession.details(globals.selected, function(result) {
            $scope.accession = result.data;
        });

        $scope.$on('accession-edit', function(){
            $scope.$apply(function() {
                $location.path('/edit/accession');
            });
        });

        $scope.$on('accession-addplant', function(){
            $scope.$apply(function() {
                $location.path('/new/plant').search({'accession': $scope.accession.ref});
            });
        });

        $scope.count = {};
        Accession.count($scope.accession, "/accessions/plants", function(result) {
            $scope.counts.plants = result.data;
        });
    });
