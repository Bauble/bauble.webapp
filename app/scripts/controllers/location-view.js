'use strict';

angular.module('BaubleApp')
  .controller('LocationViewCtrl', ['$scope', '$location', 'Alert', 'Location',
    function ($scope, $location, Alert, Location) {

        $scope.location = null;
        $scope.counts = null;

        $scope.$watch('selected', function(selected) {
            $scope.location = $scope.selected;

            Location.count($scope.location, ['/plants'])
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
    }]);
