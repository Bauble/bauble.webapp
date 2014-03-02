'use strict';

angular.module('BaubleApp')
  .controller('LocationEditCtrl', ['$scope', '$stateParams', 'Plant', 'Location',
    function ($scope, $stateParams, Plant, Location) {
        // isNew is inherited from the NewCtrl if this is a /new editor
        $scope.locaton = {};

        // make sure we have the details
        if($stateParams.id) {
            Location.get($stateParams.id)
                .success(function(data, status, headers, config) {
                    $scope.location = data;
                    console.log('$scope.location: ', $scope.location);
                })
                .error(function(data, status, headers, config) {
                    // do something
                    /* jshint -W015 */
                });
        }

        $scope.activeTab = "general";

        $scope.cancel = function() {
            window.history.back();
        };

        $scope.alerts = [];
        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };

        // called when the save button is clicked on the editor
        $scope.save = function() {
            // TODO: we need a way to determine if this is a save on a new or existing
            // object an whether we whould be calling save or edit
            Location.save($scope.location)
                .success(function(data, status, headers, config) {
                    $scope.cancel();
                })
                .error(function(data, status, headers, config) {
                    if(data) {
                        $scope.alerts.push({type: 'error', msg: "Error!\n" + data});
                    } else {
                        $scope.alerts.push({type: 'error', msg: "Unknown error!"});
                    }
                });
        };
    }]);
