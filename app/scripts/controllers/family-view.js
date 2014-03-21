'use strict';

angular.module('BaubleApp')
  .controller('FamilyViewCtrl', ['$scope', '$stateParams', '$state', '$location', 'Alert', 'Family',
    function ($scope, $stateParams, $state, $location, Alert, Family) {

        $scope.family = $scope.selected;

        $scope.$watch('selected', function(selected) {
            $scope.family = $scope.selected;
            Family.get($scope.family)
                .success(function(data, status, headers, config) {
                    $scope.family = data;
                })
                .error(function(data, status, headers, config) {
                    // do something
                    /* jshint -W015 */
                });
        });

        //$scope.family = globals.getSelected();


        $scope.$on('family-edit', function(){
            $scope.$apply(function() {
                $location.path('/edit/family');
            });
        });

        $scope.$on('family-addgenus', function(){
            $scope.$apply(function() {
                $location.path('/new/genus').search({'family': $scope.family.ref});
            });
        });

        $scope.counts = {};
        Family.count($scope.family, ['/genera', '/genera/taxa', '/genera/taxa/accessions',
                                    '/genera/taxa/accessions/plants'])
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
