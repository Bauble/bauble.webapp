'use strict';

angular.module('BaubleApp')
  .controller('GenusEditCtrl', ['$scope', '$q', '$window', '$location', '$stateParams', 'Alert', 'Family', 'Genus', 'overlay',
    function($scope, $q, $window, $location, $stateParams, Alert, Family, Genus, overlay) {

        // isNew is inherited from the NewCtrl if this is a /new editor
        $scope.genus = {
            family_id: $location.search().family,
        };

        $scope.data = {
            synonyms: [],
            notes: []
        };
        $scope.removedSynonyms = [];
        $scope.addedSynonyms = [];

        // make sure we have the family details
        if($stateParams.id) {
            overlay('loading...');
            Genus.get($stateParams.id, {embed: ['family', 'notes', 'synonyms']})
                .success(function(data, status, headers, config) {
                    $scope.genus = data;
                    $scope.family = data.family;
                    // pull out the notes and synonyms so we don't resubmit them
                    // back on save
                    $scope.data.notes = $scope.genus.notes || [];
                    $scope.data.synonyms = $scope.genus.synonyms || [];
                    delete $scope.genus.synonyms;
                    delete $scope.genus.notes;
                })
                .error(function(data, status, headers, config) {
                    var defaultMessage = "Could not get genus details.";
                    Alert.onErrorResponse(data, defaultMessage);
                })
                .finally(function() {
                    overlay.clear();
                });
        } else if($scope.genus.family_id) {
            Family.get($scope.genus.family_id, {
                pick: ['id', 'str']
            }).success(function(data, status, headers, config) {
                $scope.family = data;
            }).error(function(data, status, headers, config) {
                var defaultMessage = "Could not get family details.";
                Alert.onErrorResponse(data, defaultMessage);
            })
            .finally(function() {
                overlay.clear();
            });
        }

        //$scope.families = []; // the list of completions
        $scope.activeTab = "general";

        $scope.formatInput = function() {
            console.log('$scope.family: ', $scope.family);
            var s = $scope.family ? $scope.family.str : '';
            console.log('s: ', s);
            return s;
        };

        $scope.getFamilies = function($viewValue) {
            return Family.list({filter: {family: $viewValue + '%'}})
                .then(function(result) {
                    return result.data;
                });
        };

        $scope.getSynonyms = function($viewValue) {
            return Genus.list({filter: {genus: $viewValue + '%'}})
                .then(function(response) {
                    return response.data;
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
            // TODO: we need a way to determine if this is a save on a new or existing
            // object an whether we whould be calling save or edit
            // TODO: we should probably also update the selected result to reflect
            // any changes in the search result
            //$scope.genus.notes = $scope.notes;
            $scope.genus.family_id = $scope.family.id;
            Genus.save($scope.genus)
                .success(function(data, status, headers, config) {
                    // update the synonyms
                    $q.all(_.flatten(
                        _.map($scope.addedSynonyms, function(synonym) {
                            console.log('synonym: ', synonym);
                            return Genus.addSynonym($scope.genus, synonym);
                        }),
                        _.map($scope.removedSynonyms, function(synonym) {
                            return Genus.removeSynonym($scope.genus, synonym);
                        }))).then(function(result) {
                            console.log('result: ', result);
                            $window.history.back();
                        }).catch(function(result) {
                            var defaultMessage = "Some synonyms could not be saved.";
                            Alert.onErrorResponse(result.data, defaultMessage);
                        });

                })
                .error(function(data, status, headers, config) {
                    var defaultMessage = "The genus could not be saved.";
                    Alert.onErrorResponse(data, defaultMessage);
                });

            _.each($scope.newNote, function(note) {
            });

            _.each($scope.removedNote, function(note) {
            });
        };
    }]);
