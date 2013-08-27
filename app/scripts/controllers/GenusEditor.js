'use strict';

angular.module('BaubleApp')
    .controller('GenusEditorCtrl', function ($scope, $location, globals, Family, Genus) {

        // isNew is inherited from the NewCtrl if this is a /new editor
        $scope.genus = globals.getSelected() && !$scope.isNew ? globals.getSelected() : {};
        $scope.notes = $scope.genus.notes || [];

        // make sure we have the family details
        if($scope.genus && angular.isDefined($scope.genus.ref)) {
            Genus.details($scope.genus)
                .success(function(data, status, headers, config) {
                    $scope.genus = data;
                    $scope.notes = $scope.genus.notes || [];
                })
                .error(function(data, status, headers, config) {
                    // do something
                });
        } else if($location.search().family) {
            Family.get($location.search().family)
                .success(function(data, status, headers, config) {
                    $scope.genus.family = data;
                })
                .error(function(data, status, headers, config) {
                    // do seomthing
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
                Family.query({q: options.term + '%'})
                    .success(function(data, status, headers, config) {
                        $scope.families = data.results;
                        if(data.results && data.results.length > 0) {
                            options.callback({results: data.results});
                        }
                    })
                    .error(function(data, status, headers, config) {
                        // do something
                    });
            }
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
            $scope.genus.notes = $scope.notes;
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
        };
  });
