'use strict';

angular.module('BaubleApp')
  .controller('AccessionViewCtrl', ['$scope', '$location', '$state', 'Alert', 'Accession',
    function ($scope, $location, $state, Alert, Accession) {
        $scope.accession = $scope.selected;
        Accession.get($scope.accession)
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

        Accession.count($scope.accession, ['/plants'])
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
