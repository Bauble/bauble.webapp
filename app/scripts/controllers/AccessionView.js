'use strict';

angular.module('BaubleApp')
    .controller('AccessionViewCtrl', function ($scope, $location, globals, Accession) {
        $scope.accession = globals.getSelected();
        Accession.details($scope.accession)
            .success(function(data, status, headers, config) {
                $scope.accession = data;
            })
            .error(function(data, status, headers, config) {
                // do something
                /* jshint -W015 */
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

        $scope.counts = {};
        Accession.count($scope.accession, "/plants")
            .success(function(data, status, headers, config) {
                $scope.counts.plants = data;
            })
            .error(function(data, status, headers, config) {
                // do something
                /* jshint -W015 */
            });
    });
