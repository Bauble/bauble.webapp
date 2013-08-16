'use strict';

angular.module('BaubleApp')
    .controller('LocationEditorCtrl', function ($scope, globals, Plant, Location) {
        // isNew is inherited from the NewCtrl if this is a /new editor
        $scope.location = globals.getSelected() && !$scope.isNew ? globals.getSelected() : {};

        // make sure we have the details
        if($scope.location && angular.isDefined($scope.location.ref)) {
            Location.details($scope.location, function(result) {
                $scope.location = result.data;
            });
        }

        $scope.activeTab = "general";

        $scope.close = function() {
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
            Location.save($scope.location, function(response) {
                if(response.status < 200 || response.status >= 400) {
                    if(response.data) {
                        $scope.alerts.push({type: 'error', msg: "Error!\n" + response.data});
                    } else {
                        $scope.alerts.push({type: 'error', msg: "Unknown error!"});
                    }
                    return;
                }

                $scope.close();
            });
        };
    });
