'use strict';

angular.module('BaubleApp')
    .controller('TaxonEditorCtrl', function ($scope, $location, globals, Genus, Taxon) {
        // isNew is inherited from the NewCtrl if this is a /new editor
        $scope.taxon = globals.selected && !$scope.isNew ? globals.selected : {};
        $scope.notes = $scope.taxon.notes || [];

        // make sure we have the family details
        if($scope.taxon && angular.isDefined($scope.taxon.ref)) {
            Taxon.details($scope.taxon, function(result) {
                console.log('result.data: ', result.data);
                $scope.taxon = result.data;
                $scope.notes = $scope.taxon.notes || [];
            });
        } else if($location.search().genus) {
            Genus.get($location.search().genus, function(response) {
                if(response.status < 200 || response.status >= 400) {
                }
                $scope.taxon.genus = response.data;
            });
        }

        $scope.activeTab = "general";

        $scope.qualifiers = ["agg.", "s. lat.", "s. str."];
        $scope.ranks = ["cv.", "f.", "subf.", "subsp.", "subvar.", "var."];

        $scope.addSynonym = function(synonym) {
            if(!$scope.taxon.synonyms) {
                $scope.taxon.synonyms = [synonym];
            } else {
                $scope.taxon.synonyms.push(synonym);
            }
        };

        if(! $scope.taxon.vernacular_names) {
            $scope.taxon.vernacular_names = [{}];
            $scope.addVernacularName = function() {
                $scope.taxon.vernacular_names.push({});
            };
        }

        $scope.genusSelectOptions = {
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
                Genus.query(options.term + '%', function(response){
                    $scope.families = response.data.results;
                    if(response.data.results && response.data.results.length > 0) {
                        options.callback({results: response.data.results});
                    }
                });
            }
        };


        $scope.synSelectOptions = {
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
                Taxon.query(options.term + '%', function(response){
                    $scope.families = response.data.results;
                    if(response.data.results && response.data.results.length > 0) {
                        options.callback({results: response.data.results});
                    }
                });
            }
        };

        $scope.alerts = [];
        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };

        $scope.close = function() {
            window.history.back();
        };

        // called when the save button is clicked on the editor
        $scope.save = function() {
            $scope.taxon.notes = $scope.notes;
            Taxon.save($scope.taxon, function(response) {
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
