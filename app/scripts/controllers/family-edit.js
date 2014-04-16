'use strict';

angular.module('BaubleApp')
  .controller('FamilyEditCtrl', ['$scope', '$q', '$location', '$stateParams', 'locationStack', 'Alert', 'Family', 'overlay',
    function ($scope, $q, $location, $stateParams, locationStack, Alert, Family, overlay) {

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
            locationStack.pop();
        };


        $scope.save = function(addGenus) {
            // TODO: we should probably also update the selected result to reflect
            // any changes in the search result
            //$scope.family.notes = $scope.notes;

            Family.save($scope.family)
                .success(function(data, status, headers, config) {

                    $scope.family = data;

                    // update the synonyms
                    return $q.all(_.flatten(
                        _.map($scope.addedSynonyms, function(synonym) {
                            return Family.addSynonym($scope.family, synonym);
                        }),
                        _.map($scope.removedSynonyms, function(synonym) {
                            return Family.removeSynonym($scope.family, synonym);
                        }))).then(function(result) {
                            console.log('result: ', result);
                            if(addGenus) {
                                $location.path('/genus/add').search({'family': $scope.family.id});
                            } else {
                                locationStack.pop();
                            }

                        }).catch(function(result) {
                            var defaultMessage = "Some synonyms could not be saved.";
                            Alert.onErrorResponse(result.data, defaultMessage);
                        });
                })
                .error(function(data, status, headers, config) {
                    var defaultMessage = "The family could not be saved.";
                    Alert.onErrorResponse(data, defaultMessage);
                });

            // Todo: we need to save the synonyms and the notes...they should
            // be completely replaced...probably with a separate PUT
        };

        // $scope.saveAndAddGenus = function() {
        //     $scope.save()
        //         .success(function(data, status, headers, config) {
        //             $location.url('/genus/add').search('family_id', $scope.family.id);
        //         });
        // };
    }]);
