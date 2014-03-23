'use strict';

angular.module('BaubleApp')
  .controller('TaxonEditCtrl',
   ['$scope', '$location', '$window', '$q', '$stateParams', 'Alert', 'Genus', 'Taxon',
    function ($scope, $location, $window, $q, $stateParams, Alert, Genus, Taxon) {
        // isNew is inherited from the NewCtrl if this is a /new editor
        $scope.taxon = {
            genus_id: $location.search().genus,
        };

        $scope.data = {
            synonyms: [],
            names: [],
            notes: []
        };
        $scope.removedSynonyms = [];
        $scope.addedSynonyms = [];
        $scope.removedNames = [];

        $scope.genus = {};

        // make sure we have the family details
        if($stateParams.id) {
            Taxon.get($stateParams.id, {embed: ['genus', 'vernacular_names', 'synonyms']})
                .success(function(data, status, headers, config) {
                    $scope.taxon = data;
                    $scope.genus = data.genus;
                    $scope.data.notes = $scope.taxon.notes || [];
                    $scope.data.names = $scope.taxon.vernacular_names || [];
                    if($scope.data.names.length === 0) {
                        $scope.addName({});
                    }

                    $scope.data.synonyms = $scope.taxon.synonyms || [];
                    // delete the embedded properties so we don't resubmit them
                    delete $scope.taxon.genus;
                    delete $scope.taxon.synonyms;
                    delete $scope.taxon.vernacular_names;
                    delete $scope.taxon.notes;
                })
                .error(function(data, status, headers, config) {
                    var defaultMessage = "Could not get taxon details.";
                    Alert.onErrorResponse(data, defaultMessage);
                });
        } else if($scope.taxon.genus_id) {
            Genus.get($scope.taxon.genus_id)
                .success(function(data, status, headers, config) {
                    $scope.genus = data;
                })
                .error(function(data, status, headers, config) {
                    var defaultMessage = "Could not get genus details.";
                    Alert.onErrorResponse(data, defaultMessage);
                });
        }

        $scope.activeTab = "general";

        $scope.qualifiers = ["agg.", "s. lat.", "s. str."];
        $scope.ranks = ["cv.", "f.", "subf.", "subsp.", "subvar.", "var."];


        // get genera for the genus completions
        $scope.getGenera = function($viewValue) {
            return Genus.list({filter: {genus: $viewValue + '%'}})
                .then(function(result) {
                    return result.data;
                });
        };

        // get the taxa for the synonyms completion
        $scope.getSynonyms = function($viewValue) {
            // TODO: do we need to match on more than just the genus for genera
            // with lots of taxa...we could probably do further filtering using
            // angular and filtering on the taxon.str property
            return Taxon.list({filter: {genus: $viewValue + '%'}})
                .then(function(result) {
                    return result.data;
                });
        };

        // add a synonym
        $scope.addSynonym = function(synonym) {
            $scope.data.synonyms.push(synonym);
            $scope.addedSynonyms.push(synonym);
        };

        // remove a synonym
        $scope.removeSynonym = function(synonym) {
            $scope.removedSynonyms.push(synonym);
            _.remove($scope.data.synonyms, {$$hashKey: synonym.$$hashKey });
        };


        // remove a vernacular name
        $scope.removeName = function(name) {

            _.remove($scope.data.names, {$$hashKey: name.$$hashKey });
            if(name.id) {
                $scope.removedNames.push(name);
            }
        };


        $scope.cancel = function() {
            $window.history.back();
        };

        // called when the save button is clicked on the editor
        $scope.save = function() {

            $scope.taxon.genus_id = $scope.genus.id;

            // remove any notes without a note
            // angular.forEach($scope.notes, function(note, key) {
            //     if(note.note){
            //         $scope.taxon.notes.push(note);
            //     }
            // });

            function saveNames() {

                // TODO: we don't have way to update names here...only add and
                // remove

                return $q.all(_.flatten(
                    _.map($scope.data.names, function(name) {
                        return Taxon.saveName($scope.taxon, name);
                    }),
                    _.map($scope.removedNames, function(name) {
                        return Taxon.removeName($scope.taxon, name);
                    }))).then(function(result) {
                        console.log('names result: ', result);
                        $window.history.back();
                    }).catch(function(result) {
                        var defaultMessage = "Some names could not be saved.";
                        Alert.onErrorResponse(result.data, defaultMessage);
                    });
            }

            function saveSynonyms() {
                return $q.all(_.flatten(
                    _.map($scope.addedSynonyms, function(synonym) {
                        return Taxon.addSynonym($scope.genus, synonym);
                    }),
                    _.map($scope.removedSynonyms, function(synonym) {
                        return Taxon.removeSynonym($scope.genus, synonym);
                    }))).then(function(result) {
                        console.log('syn result: ', result);
                        $window.history.back();
                    }).catch(function(result) {
                        var defaultMessage = "Some synonyms could not be saved.";
                        Alert.onErrorResponse(result.data, defaultMessage);
                    });
            }

            Taxon.save($scope.taxon)
                .success(function(data, status, headers, config) {
                    saveSynonyms()
                        .then(function(result) {
                            saveNames()
                                .then(function(result){
                                    $window.history.back();
                                })
                                .catch(function(result){
                                    var defaultMessage = "Some names could not be saved.";
                                    Alert.onErrorResponse(result.data, defaultMessage);
                                });
                        })
                        .catch(function(result) {
                            var defaultMessage = "Some synonyms could not be saved.";
                            Alert.onErrorResponse(result.data, defaultMessage);
                        });


                })
                .error(function(data, status, headers, config) {
                    var defaultMessage = "The taxon could not be saved.";
                    Alert.onErrorResponse(data, defaultMessage);
                });
        };
    }]);
