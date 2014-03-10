'use strict';

angular.module('BaubleApp')
  .controller('FamilyEditCtrl', ['$scope', '$q', '$stateParams', 'Alert', 'Family',
    function ($scope, $q, $stateParams, Alert, Family) {

        $scope.overlay = $stateParams.family_id ? "loading..." : null;
        // isNew is inherited from the NewCtrl if this is a /new editor
        //$scope.family = globals.getSelected() && !$scope.isNew ? globals.getSelected() : {};
        $scope.family = {};
        $scope.data = {
            synonyms: [],
            notes: []
        };
        $scope.synonyms = [];
        $scope.qualifiers = ["s. lat.", "s. str."];
        $scope.removedSynonyms = [];

        if($stateParams.id) {
            Family.get($stateParams.id, {embed: ['notes', 'synonyms']})
                .success(function(data, status, headers, config) {
                    $scope.family = data;

                    // pull out the notes and synonyms so we don't resubmit them
                    // back on save
                    $scope.data.notes = $scope.family.notes || [];
                    $scope.data.synonyms = $scope.family.synonyms || [];
                    delete $scope.family.synonyms;
                    delete $scope.family.notes;
                    $scope.overlay = null;
                })
                .error(function(data, status, headers, config) {
                    $scope.overlay = null;
                });
        }


        $scope.getSynonyms = function($viewValue) {
            return Family.list({filter: {family: $viewValue + '%'}})
                .then(function(response) {
                    console.log('response.data: ', response.data);
                    return response.data;
                });
        };


        $scope.addedSynonyms = [];
        $scope.addSynonym = function(synonym) {
            console.log('synonym: ', synonym);
            $scope.data.synonyms.push(synonym);
            $scope.addedSynonyms.push(synonym);
            console.log('$scope.synonyms: ', $scope.synonyms);
        };

        $scope.removeSynonym = function(synonym) {
            $scope.removedSynonyms.push(synonym);
            _.remove($scope.data.synonyms, {$$hashKey: synonym.$$hashKey });
        };

        $scope.cancel = function() {
            window.history.back();
        };


        $scope.save = function() {
            // TODO: we should probably also update the selected result to reflect
            // any changes in the search result
            //$scope.family.notes = $scope.notes;
            console.log('$scope.family: ', $scope.family);
            if($scope.familyForm.general.$dirty) {
                Family.save($scope.family)
                    .success(function(data, status, headers, config) {

                        $q.all(_.flatten(
                            _.map($scope.addedSynonyms, function(synonym) {
                                return Family.addSynonym($scope.family, synonym);
                            }),
                            _.map($scope.removedSynonyms, function(synonym) {
                                return Family.removeSynonym($scope.family, synonym);
                            }))).then(function(result) {
                                $scope.cancel();
                            }).catch(function(result) {
                                var defaultMessage = "Some synonyms could not be saved.";
                                Alert.onErrorResponse(result.data, defaultMessage);
                            });


                        $scope.cancel();
                    })
                    .error(function(data, status, headers, config) {
                        var defaultMessage = data ? "Error!\n" + data : "Unknown error!";
                        Alert.onErrorResponse(data, defaultMessage);
                    });
            }


            console.log('$scope.addedsynonyms: ', $scope.addedSynonyms);




            _.each($scope.removedSynonyms, function(synonym) {
                console.log('remove synonym: ', synonym);
                Family.removeSynonym($scope.family, synonym);
            });

            // TODO: we need to save the synonyms and the notes...they should
            // be completely replaced...probably with a separate PUT
        };
    }]);
