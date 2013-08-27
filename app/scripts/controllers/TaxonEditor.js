'use strict';

angular.module('BaubleApp')
    .controller('TaxonEditorCtrl', function ($scope, $location, globals, Genus, Taxon) {
        // isNew is inherited from the NewCtrl if this is a /new editor
        $scope.taxon = globals.getSelected() && !$scope.isNew ? globals.getSelected() : {};
        $scope.notes = $scope.taxon.notes || [];

        // make sure we have the family details
        if($scope.taxon && angular.isDefined($scope.taxon.ref)) {
            Taxon.details($scope.taxon)
                .success(function(data, status, headers, config) {
                    $scope.taxon = data;
                    $scope.notes = $scope.taxon.notes || [];
                    $scope.addVernacularName();
                })
                .error(function(data, status, headers, config) {
                   // do something
                });
        } else if($location.search().genus) {
            Genus.get($location.search().genus)
                .success(function(data, status, headers, config) {
                    $scope.taxon.genus = data;
                })
                .error(function(data, status, headers, config) {
                    // do something
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

        $scope.addVernacularName = function() {
            if(!$scope.taxon.vernacular_names) {
                $scope.taxon.vernacular_names = [];
            }
            $scope.taxon.vernacular_names.push({});
        };

        $scope.addVernacularName(); // make sure there always and empty row

        $scope.genusSelectOptions = {
            minimumInputLength: 1,

            formatResult: function(object, container, query) { return object.str; },
            formatSelection: function(object, container) { return object.str; },

            id: function(obj) {
                return obj.ref; // use ref field for id since our resources don't have is
            },

            // get the list of families matching the query
            query: function(options){
                // TODO: somehow we need to cache the returned results and early search
                // for new results when the query string is something like .length==2
                // console.log('query: ', options);....i think this is what the
                // options.context is for
                Genus.query({q: options.term + '%'})
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
                Taxon.query(options.term + '%')
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
            // remove any notes without a note
            angular.forEach($scope.notes, function(note, key) {
                if(note.note){
                    $scope.taxon.notes.push(note);
                }
            });

            // TODO: this isn't going to remove any vernacular names on the taxon
            // only add new ones that don't exist

            // remove any vernacular names with a name
            var tmpNames = [];
            angular.forEach($scope.taxon.vernacular_names, function(vern, key) {
                if(vern.name){
                    tmpNames.push(vern);
                }
                $scope.taxon.vernacular_names = tmpNames;
            });

            Taxon.save($scope.taxon)
                .success(function(data, status, headers, config) {
                    $scope.cancel();
                })
                .error(function(data, status, headers, config) {
                    var msg = data ? "Error!\n" + data : "Unknown error!";
                    $scope.alerts.push({type: 'error', msg: msg});
                });
        };
    });
