'use strict';

angular.module('BaubleApp')
  .controller('GenusViewCtrl', ['$scope', '$location', 'Alert', 'Genus',
    function ($scope, $location, Alert, Genus) {

        $scope.genus = $scope.selected;

        Genus.get($scope.genus)
            .success(function(data, status, headers, config) {
                $scope.genus = data;
            })
            .error(function(data, status, headers, config) {
                // do something
                /* jshint -W015 */
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
                var defaultMessage = "Count not count the relations";
                Alert.onErrorResponse(data, defaultMessage);
            });
    }]);
