'use strict';

angular.module('BaubleApp')
    .controller('TaxonViewCtrl', function ($scope, $location, Alert, Taxon) {

        $scope.taxon = null;
        $scope.counts = null;

        $scope.$watch('selected', function(selected) {
            $scope.taxon = $scope.selected;
            Taxon.get($scope.taxon, {embed: ['synonyms', 'vernacular_names']})
                .success(function(data, status, headers, config) {
                    $scope.taxon = data;
                })
                .error(function(data, status, headers, config) {
                    var defaultMessage = 'Could not get taxon details';
                    Alert.onErrorResponse(data, defaultMessage);
                });

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
    });
