'use strict';

var acc_type_values ={
    'Plant': 'Plant',
    'Seed': 'Seed/Spore',
    'Vegetative': 'Vegetative Part',
    'Tissue': 'Tissue Culture',
    'Other': 'Other',
    None: ''
};

angular.module('BaubleApp')
    .controller('PlantEditorCtrl', function ($scope, $location, globals, Accession, Plant) {

        // isNew is inherited from the NewCtrl if this is a /new editor
        $scope.plant = globals.selected && !$scope.isNew ? globals.selected : {}
        $scope.notes = $scope.plant.notes || []
        $scope.propagation = {};

        // make sure we have the details
        if($scope.plant && angular.isDefined($scope.plant.ref)) {
            Plant.details($scope.plant, function(result) {
                $scope.plant = result.data;
                $scope.notes = $scope.plant.notes || [];
            });
        } else if($location.search().accession) {
            Accession.details($location.search().accession, function(response) {
                if(response.status < 200 || response.status >= 400) {
                }
                $scope.plant.accession = response.data
            });
        }

        $scope.propagation = {};  // inherited by the PropagationEditorCtrl

        $scope.activeTab = "general";

        $scope.acc_type_values = acc_type_values;

        $scope.accSelectOptions = {
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
                Accession.query(options.term + '%', function(response){
                    if(response.data.results && response.data.results.length > 0)
                        options.callback({results: response.data.results});
                });
            }
        };

        $scope.locationSelectOptions = {
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
                Location.query(options.term + '%', function(response){
                    if(response.data.results && response.data.results.length > 0)
                        options.callback({results: response.data.results});
                });
            }
        };

        $scope.alerts = [];
        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };

        $scope.close = function() {
            window.history.back();
        }

        // called when the save button is clicked on the editor
        $scope.save = function() {
            $scope.plant.notes = $scope.notes
            Plant.save($scope.plant, function(response) {
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
