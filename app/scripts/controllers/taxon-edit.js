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
            notes: []
        };
        $scope.removedSynonyms = [];
        $scope.addedSynonyms = [];

        $scope.genus = {};

        // make sure we have the family details
        if($stateParams.id) {
            Taxon.get($stateParams.id, {embed: ['genus', 'vernacular_names', 'synonyms']})
                .success(function(data, status, headers, config) {
                    $scope.taxon = data;
                    $scope.genus = data.genus;
                    $scope.data.notes = $scope.taxon.notes || [];
                    $scope.data.synonyms = $scope.taxon.synonyms || [];
                    delete $scope.taxon.synonyms;
                    delete $scope.taxon.notes;
                    $scope.addVernacularName();
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


        $scope.addVernacularName = function() {
            if(!$scope.taxon.vernacular_names) {
                $scope.taxon.vernacular_names = [];
            }
            $scope.taxon.vernacular_names.push({});
        };

        $scope.addVernacularName(); // make sure there always and empty row

        $scope.getGenera = function($viewValue) {
            return Genus.list({filter: {genus: $viewValue + '%'}})
                .then(function(result) {
                    return result.data;
                });
        };

        $scope.getSynonyms = function($viewValue) {
            return Taxon.list({filter: {genus: $viewValue + '%'}})
                .then(function(result) {
                    return result.data;
                });
        };

        $scope.addSynonym = function(synonym) {
            $scope.data.synonyms.push(synonym);
            $scope.addedSynonyms.push(synonym);
        };

        $scope.removeSynonym = function(synonym) {
            $scope.removedSynonyms.push(synonym);
            _.remove($scope.data.synonyms, {$$hashKey: synonym.$$hashKey });
        };


        $scope.cancel = function() {
            $window.history.back();
        };

        // called when the save button is clicked on the editor
        $scope.save = function() {

            $scope.taxon.genus_id = $scope.genus.id;

            // remove any notes without a note
            angular.forEach($scope.notes, function(note, key) {
                if(note.note){
                    $scope.taxon.notes.push(note);
                }
            });

            // TODO: this isn't going to remove any vernacular names on the taxon
            // only add new ones that don't exist

            // remove any vernacular names with a name
            // var tmpNames = [];
            // angular.forEach($scope.taxon.vernacular_names, function(vern, key) {
            //     if(vern.name){
            //         tmpNames.push(vern);
            //     }
            //     $scope.taxon.vernacular_names = tmpNames;
            // });

            Taxon.save($scope.taxon)
                .success(function(data, status, headers, config) {
                    $q.all(_.flatten(
                        _.map($scope.addedSynonyms, function(synonym) {
                            console.log('synonym: ', synonym);
                            return Taxon.addSynonym($scope.genus, synonym);
                        }),
                        _.map($scope.removedSynonyms, function(synonym) {
                            return Taxon.removeSynonym($scope.genus, synonym);
                        }))).then(function(result) {
                            console.log('result: ', result);
                            $window.history.back();
                        }).catch(function(result) {
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
