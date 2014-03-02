'use strict';

angular.module('BaubleApp')
  .controller('GenusEditCtrl', ['$scope', '$location', '$stateParams', 'Family', 'Genus',
    function($scope, $location, $stateParams, Family, Genus) {

        // isNew is inherited from the NewCtrl if this is a /new editor
        $scope.genus = {
            family_id: $location.search().family,
        };

        $scope.notes = [];

        console.log('$scope.genus: ', $scope.genus);

        // make sure we have the family details
        if($stateParams.id) {
            Genus.get($stateParams.id, {embed: ['family', 'notes', 'synonyms']})
                .success(function(data, status, headers, config) {
                    console.log('data: ', data);
                    $scope.genus = data;
                    $scope.family = data.family;
                })
                .error(function(data, status, headers, config) {
                    // do something
                    /* jshint -W015 */
                });
        } else if($scope.genus.family_id) {
            Family.get($scope.genus.family_id, {
                pick: ['id', 'str']
            }).success(function(data, status, headers, config) {
                $scope.family = data;
            }).error(function(data, status, headers, config) {
                // do something
                /* jshint -W015 */
            });
        }

        //$scope.families = []; // the list of completions
        $scope.activeTab = "general";

        $scope.formatInput = function() {
            console.log('$scope.family: ', $scope.family);
            var s = $scope.family ? $scope.family.str : '';
            console.log('s: ', s);
            return s;
        };

        $scope.getFamilies = function($viewValue) {
            return Family.list({filter: {family: $viewValue + '%'}})
                .then(function(result) {
                    return result.data;
                });
        };

        $scope.alerts = [];
        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };

        $scope.cancel = function() {
            window.history.back();
        };

        // called when the save button is clicked on the editor
        $scope.save = function() {
            // TODO: we need a way to determine if this is a save on a new or existing
            // object an whether we whould be calling save or edit
            // TODO: we should probably also update the selected result to reflect
            // any changes in the search result
            //$scope.genus.notes = $scope.notes;
            $scope.genus.family_id = $scope.family.id;
            Genus.save($scope.genus)
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

            _.each($scope.newNote, function(note) {
            });

            _.each($scope.removedNote, function(note) {
            });
        };
    }]);
