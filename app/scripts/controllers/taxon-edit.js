'use strict';

angular.module('BaubleApp')
    .controller('TaxonEditCtrl', function ($scope, $location, $stateParams, Genus, Taxon) {
        // isNew is inherited from the NewCtrl if this is a /new editor
        $scope.taxon = {
            genus_id: $location.search().genus,
        };
        $scope.genus = {};

        $scope.notes = [];

        // make sure we have the family details
        if($stateParams.id) {
            Taxon.get($stateParams.id, {embed: ['genus', 'vernacular_names', 'synonyms']})
                .success(function(data, status, headers, config) {
                    $scope.taxon = data;
                    $scope.genus = data.genus;
                    $scope.notes = $scope.taxon.notes || [];
                    $scope.addVernacularName();
                })
                .error(function(data, status, headers, config) {
                   // do something
                    /* jshint -W015 */
                });
        } else if($scope.taxon.genus_id) {
            Genus.get($scope.taxon.genus_id)
                .success(function(data, status, headers, config) {
                    $scope.genus = data;
                })
                .error(function(data, status, headers, config) {
                    // do something
                    /* jshint -W015 */
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

        $scope.getGenera = function($viewValue) {
            return Genus.list({filter: {genus: $viewValue + '%'}})
                .then(function(result) {
                    return result.data;
                });
        };

        $scope.getSynonyms = function($viewValue) {
            return Taxon.list({filter: {family: $viewValue + '%'}})
                .then(function(result) {
                    console.log('result.data: ', result.data);
                    return result.data;
                });
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
