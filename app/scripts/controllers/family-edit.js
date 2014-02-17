'use strict';

angular.module('BaubleApp')
    .controller('FamilyEditCtrl', function ($scope, $stateParams, Family) {

        $scope.overlay = $stateParams.family_id ? "loading..." : null;
        // isNew is inherited from the NewCtrl if this is a /new editor
        //$scope.family = globals.getSelected() && !$scope.isNew ? globals.getSelected() : {};
        $scope.family = {};
        $scope.notes = [];
        $scope.qualifiers = ["s. lat.", "s. str."];

        if($stateParams.family_id) {
            Family.get($stateParams.family_id, {embed: ['notes', 'synonyms']})
                .success(function(data, status, headers, config) {
                    $scope.family = data;

                    // pull out the notes and synonyms so we don't resubmit them
                    // back on save
                    $scope.notes = $scope.family.notes || [];
                    $scope.synonyms = $scope.family.synonyms || [];
                    delete $scope.family.synonyms;
                    delete $scope.family.notes;
                    $scope.overlay = null;
                })
                .error(function(data, status, headers, config) {
                    $scope.overlay = null;
                });
        }


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
                    if(response.data.results && response.data.results.length > 0) {
                        options.callback({results: response.data.results});
                    }
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

        $scope.cancel = function() {
            window.history.back();
        };

        $scope.alerts = [];
        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };

        $scope.save = function() {
            // TODO: we should probably also update the selected result to reflect
            // any changes in the search result
            //$scope.family.notes = $scope.notes;
            console.log('$scope.family: ', $scope.family);
            Family.save($scope.family)
                .success(function(data, status, headers, config) {
                    $scope.cancel();
                })
                .error(function(data, status, headers, config) {
                    var msg = data ? "Error!\n" + data : "Unknown error!";
                    $scope.alerts.push({type: 'error', msg: msg});
                });

            // TODO: we need to save the synonyms and the notes...they should
            // be completely replaced...probably with a separate PUT
        };
    });
