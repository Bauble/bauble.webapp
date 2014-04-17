'use strict';

angular.module('BaubleApp')
  .controller('TaxonEditCtrl',
   ['$scope', '$location', '$q', '$http', '$stateParams', 'locationStack', 'Alert', 'Genus', 'Taxon', 'overlay',
    function ($scope, $location, $q, $http, $stateParams, locationStack, Alert, Genus, Taxon, overlay) {
        // isNew is inherited from the NewCtrl if this is a /new editor
        $scope.taxon = {
            genus_id: $location.search().genus,
        };

        $scope.data = {
            synonyms: new InstrumentedArray(),
            names: new InstrumentedArray(),
            notes: new InstrumentedArray(),
            distribution: new InstrumentedArray(),
        };

        $scope.genus = {};

        $http.get('/data/geography.js')
            .success(function(data, status, headers, config) {
                $scope.geography = data;
                console.log('data: ', data);
            })
            .error(function(data, status, headers, config) {
                var defaultMessage = 'Could not get data for distribution menu.';
                Alert.onErrorResponse(data, defaultMessage);
            });

        // make sure we have the taxon details
        if($stateParams.id) {
            overlay('loading...');
            Taxon.get($stateParams.id, {embed: ['genus', 'vernacular_names', 'synonyms', 'distribution']})
                .success(function(data, status, headers, config) {
                    $scope.taxon = data;
                    $scope.genus = data.genus;
                    $scope.data.notes = new InstrumentedArray($scope.taxon.notes || []);
                    $scope.data.distributions = new  InstrumentedArray(_.sortBy($scope.taxon.distribution, 'id') || []);
                    $scope.data.names = new InstrumentedArray($scope.taxon.vernacular_names || [{}]);
                    $scope.data.synonyms = new InstrumentedArray($scope.taxon.synonyms || []);
                    // delete the embedded properties so we don't resubmit them
                    delete $scope.taxon.genus;
                    delete $scope.taxon.synonyms;
                    delete $scope.taxon.vernacular_names;
                    delete $scope.taxon.notes;
                })
                .error(function(data, status, headers, config) {
                    var defaultMessage = "Could not get taxon details.";
                    Alert.onErrorResponse(data, defaultMessage);
                })
                .finally(function() {
                    overlay.clear();
                });
        } else if($scope.taxon.genus_id) {
            overlay('loading...');
            Genus.get($scope.taxon.genus_id)
                .success(function(data, status, headers, config) {
                    $scope.genus = data;
                })
                .error(function(data, status, headers, config) {
                    var defaultMessage = "Could not get genus details.";
                    Alert.onErrorResponse(data, defaultMessage);
                })
                .finally(function() {
                    overlay.clear();
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

        $scope.cancel = function() {
            locationStack.pop();
        };

        // called when the save button is clicked on the editor
        $scope.save = function(addAccession) {

            $scope.taxon.genus_id = $scope.genus.id;

            // remove any notes without a note
            // angular.forEach($scope.notes, function(note, key) {
            //     if(note.note){
            //         $scope.taxon.notes.push(note);
            //     }
            // });

            function saveNames() {
                return $q.all(_.flatten(
                    _.map($scope.data.names.added, function(name) {
                        return Taxon.saveName($scope.taxon, name);
                    }),
                    _.map($scope.data.names.removed, function(name) {
                        return Taxon.removeName($scope.taxon, name);
                    })))
                    .catch(function(result) {
                        var defaultMessage = "Some names could not be saved.";
                        Alert.onErrorResponse(result.data, defaultMessage);
                        $q.reject(result);
                    });
            }

            function saveSynonyms() {
                return $q.all(_.flatten(
                    _.map($scope.data.synonyms.added, function(synonym) {
                        return Taxon.addSynonym($scope.taxon, synonym);
                    }),
                    _.map($scope.data.synonyms.removed, function(synonym) {
                        return Taxon.removeSynonym($scope.taxon, synonym);
                    })))
                    .catch(function(result) {
                        var defaultMessage = "Some synonyms could not be saved.";
                        Alert.onErrorResponse(result.data, defaultMessage);
                        $q.reject(result);
                    });
            }

            function saveDistributions() {
                return $q.all(_.flatten(
                    _.map($scope.data.distribution.added, function(distribution) {
                        return Taxon.addDistribution($scope.taxon, distribution);
                    }),
                    _.map($scope.data.distribution.removed, function(distribution) {
                        return Taxon.removeDistribution($scope.taxon, distribution);
                    })))
                    .catch(function(result) {
                        var defaultMessage = "Some distributions could not be saved.";
                        Alert.onErrorResponse(result.data, defaultMessage);
                        $q.reject(result);
                    });

            }

            Taxon.save($scope.taxon)
                .success(function(data, status, headers, config) {

                    $scope.taxon = data;

                    $q.all(saveSynonyms(),
                           saveNames(),
                           saveDistributions())
                        .then(function(results) {
                            if(addAccession) {
                                $location.path('/accession/add').search({'taxon': $scope.taxon.id});
                            } else {
                                locationStack.pop();
                            }
                            //return results;
                        });
                })
                .error(function(data, status, headers, config) {
                    var defaultMessage = "The taxon could not be saved.";
                    Alert.onErrorResponse(data, defaultMessage);
                });
        };
    }]);
