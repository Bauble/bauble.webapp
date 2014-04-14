'use strict';

angular.module('BaubleApp')
  .controller('FamilyEditCtrl', ['$scope', '$q', '$window', '$stateParams', 'Alert', 'Family', 'overlay',
    function ($scope, $q, $window, $stateParams, Alert, Family, overlay) {

        $scope.family = {};
        $scope.data = {
            synonyms: [],
            notes: []
        };

        $scope.qualifiers = ["s. lat.", "s. str."];
        $scope.removedSynonyms = [];
        $scope.addedSynonyms = [];

        if($stateParams.id) {
            overlay("loading...");
            Family.get($stateParams.id, {embed: ['notes', 'synonyms']})
                .success(function(data, status, headers, config) {
                    $scope.family = data;

                    // pull out the notes and synonyms so we don't resubmit them
                    // back on save
                    $scope.data.notes = $scope.family.notes || [];
                    $scope.data.synonyms = $scope.family.synonyms || [];
                    delete $scope.family.synonyms;
                    delete $scope.family.notes;
                })
                .error(function(data, status, headers, config) {
                    var defaultMessage = "Could not load family details.";
                    Alert.onErrorResponse(data, defaultMessage);
                })
                .finally(function() {
                    overlay.clear();
                });
        }


        $scope.getSynonyms = function($viewValue) {
            return Family.list({filter: {family: $viewValue + '%'}})
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


        $scope.save = function() {
            // TODO: we should probably also update the selected result to reflect
            // any changes in the search result
            //$scope.family.notes = $scope.notes;

            Family.save($scope.family)
                .success(function(data, status, headers, config) {

                    // update the synonyms
                    $q.all(_.flatten(
                        _.map($scope.addedSynonyms, function(synonym) {
                            return Family.addSynonym($scope.family, synonym);
                        }),
                        _.map($scope.removedSynonyms, function(synonym) {
                            return Family.removeSynonym($scope.family, synonym);
                        }))).then(function(result) {
                            $window.history.back();
                        }).catch(function(result) {
                            var defaultMessage = "Some synonyms could not be saved.";
                            Alert.onErrorResponse(result.data, defaultMessage);
                        });
                })
                .error(function(data, status, headers, config) {
                    var defaultMessage = "The family could not be saved.";
                    Alert.onErrorResponse(data, defaultMessage);
                });

            // TODO: we need to save the synonyms and the notes...they should
            // be completely replaced...probably with a separate PUT
        };
    }]);
