'use strict';

angular.module('BaubleApp')
    .controller('GenusEditorCtrl', function ($scope, $location, globals, Family, Genus) {

        // isNew is inherited from the NewCtrl if this is a /new editor
        $scope.genus = globals.selected && !$scope.isNew ? globals.selected : {};
        $scope.notes = $scope.genus.notes ? $scope.genus.notes : [];

        // make sure we have the family details
        if($scope.genus && angular.isDefined($scope.genus.ref)) {
            Genus.details($scope.genus, function(result) {
                $scope.genus = result.data;
                $scope.notes = $scope.genus.notes;
            });
        } else if($location.search().family) {
            Family.get($location.search().family, function(response) {
                if(response.status < 200 || response.status >= 400) {
                }
                $scope.genus.family = response.data
            });
        }

        //$scope.families = []; // the list of completions
        $scope.activeTab = "general";

        $scope.familySelectOptions = {
            minimumInputLength: 1,

            formatResult: function(object, container, query) { return object.str; },
            formatSelection: function(object, container) { return object.str; },

            id: function(obj) {
                return obj.ref; // use ref field for id since our resources don't have ids
            },

            // get the list of families matching the query
            query: function(options){
                // TODO: somehow we need to cache the returned results and early search
                // for new results when the query string is something like .length==2
                // console.log('query: ', options);....i think this is what the
                // options.context is for
                Family.query(options.term + '%', function(response){
                    $scope.families = response.data.results;
                    if(response.data.results && response.data.results.length > 0)
                        options.callback({results: response.data.results});
                });
            }
        };

        $scope.alerts = [];
        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };

        $scope.close = function() {
            window.history.back();
        }

        // called when the save button is clicked on the editor
        $scope.save = function() {
            // TODO: we need a way to determine if this is a save on a new or existing
            // object an whether we whould be calling save or edit
            // TODO: we should probably also update the selected result to reflect
            // any changes in the search result
            $scope.genus.notes = $scope.notes
            Genus.save($scope.genus, function(response) {
                console.log('response: ', response);
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
