'use strict';

angular.module('BaubleApp')
    .controller('FamilyEditorCtrl', function ($scope, globals, Family) {

        // isNew is inherited from the NewCtrl if this is a /new editor
        $scope.family = globals.selected && !$scope.isNew ? globals.selected : {};
        $scope.notes = $scope.family.notes || [];

        // make sure we have the family details
        if($scope.family && angular.isDefined($scope.family.ref)) {
            Family.details($scope.family, function(result) {
                $scope.family = result.data;
                $scope.notes = $scope.family.notes || [];
            });
        }

        $scope.activeTab = "general";
        $scope.qualifiers = ["s. lat.", "s. str."];

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

        $scope.addSynonym = function(synonym) {
            if(!$scope.family.synonyms) {
                $scope.family.synonyms = [synonym];
            } else {
                $scope.family.synonyms.push(synonym);
            }
        };

        $scope.close = function() {
            window.history.back();
        }

        $scope.alerts = [];
        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };

        $scope.save = function() {
            // TODO: we should probably also update the selected result to reflect
            // any changes in the search result
            $scope.family.notes = $scope.notes
            Family.save($scope.family, function(response) {
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
