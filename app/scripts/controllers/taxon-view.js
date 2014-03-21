'use strict';

angular.module('BaubleApp')
    .controller('TaxonViewCtrl', function ($scope, $location, Alert, Taxon) {

        $scope.taxon = $scope.selected;

        Taxon.get($scope.taxon)
            .success(function(data, status, headers, config) {
                $scope.taxon = data;
            })
            .error(function(data, status, headers, config) {
                // do something
                /* jshint -W015 */
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

        Taxon.count($scope.taxon, ['/accessions', '/accessions/plants'])
            .success(function(data, status, headers, config) {
                $scope.counts = data;
                _.each(data, function(value, key) {
                    // keys are in '/' notation
                    key = _.last(key.split('/'));
                    $scope.counts[key] = value;
                });
            })
            .error(function(data, status, headers, config) {
                var defaultMessage = "Count not count the relations";
                Alert.onErrorResponse(data, defaultMessage);
            });
    });
