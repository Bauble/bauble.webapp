'use strict';

angular.module('BaubleApp')
  .controller('GenusViewCtrl', ['$scope', '$location', 'Alert', 'Genus',
    function ($scope, $location, Alert, Genus) {

        $scope.genus = null;
        $scope.counts = null;

        $scope.$watch('selected', function(selected) {
            $scope.genus = $scope.selected;

            Genus.get($scope.genus, {embed: ['synonyms']})
                .success(function(data, status, headers, config) {
                    $scope.genus = data;
                })
                .error(function(data, status, headers, config) {
                    var defaultMessage = 'Could not get genus details';
                    Alert.onErrorResponse(data, defaultMessage);
                });


            Genus.count($scope.genus, ['/taxa', '/taxa/accessions', '/taxa/accessions/plants'])
                .success(function(data, status, headers, config) {
                    $scope.counts = data;
                    _.each(data, function(value, key) {
                        // keys are in '/' notation
                        key = _.last(key.split('/'));
                        $scope.counts[key] = value;
                    });
                })
                .error(function(data, status, headers, config) {
                    var defaultMessage = "Could not count the relations";
                    Alert.onErrorResponse(data, defaultMessage);
                });
        });
    }]);
