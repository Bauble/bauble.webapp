'use strict';

angular.module('BaubleApp')
    .controller('GenusEditorCtrl', function ($scope, Family, Genus) {
        $scope.Genus = Genus;
        $scope.genus = {};

        $scope.families = []; // the list of completions
        $scope.activeTab = "general";

        // get the genus details when the selection is changed
        $scope.$watch('selected', function() {
            console.log('$scope.selected: ', $scope.selected);
            if(! $scope.selected) return;
            $scope.Genus.details($scope.selected, function(result) {
                $scope.genus = result.data;
            });
        });

        $scope.selectOptions = {
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

        $scope.close = function() {
            $scope.showEditor = false;
        }

        // called when the save button is clicked on the editor
        $scope.save = function() {
            // TODO: we need a way to determine if this is a save on a new or existing
            // object an whether we whould be calling save or edit
            $scope.Genus.save($scope.genus);
            $scope.close();
        };
  });
