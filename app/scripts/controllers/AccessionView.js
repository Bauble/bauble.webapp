'use strict';

angular.module('BaubleApp')
    .controller('AccessionViewCtrl', function ($scope, Accession) {
        $scope.Accession = Accession;
        $scope.accession = {};

        // get the taxon details when the selection is changed
        $scope.$watch('selected', function() {
            $scope.Accession.details($scope.selected, function(result) {
                $scope.accession = result.data;
            });
        });

        $scope.$on('accession-edit', function(){
            $scope.$apply(function() {
                $location.path('/edit/accession')
            });
        });
    });
