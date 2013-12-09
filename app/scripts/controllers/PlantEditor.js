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
    .controller('PlantEditorCtrl',
        function ($scope, $location, globals, Accession, Plant, Location) {

        // isNew is inherited from the NewCtrl if this is a /new editor
        $scope.plant = globals.getSelected() && !$scope.isNew ? globals.getSelected() : {};
        $scope.notes = $scope.plant.notes || [];
        $scope.propagation = {};

        // make sure we have the details
        if($scope.plant && angular.isDefined($scope.plant.ref)) {
            Plant.details($scope.plant)
                .success(function(data, status, headers, config) {
                    $scope.plant = data;
                    $scope.notes = $scope.plant.notes || [];
                })
                .error(function(data, status, headers, config) {
                    // do something
                    /* jshint -W015 */
                });
        } else if($location.search().accession) {
            Accession.details($location.search().accession)
                .success(function(data, status, headers, config) {
                    $scope.plant.accession = data;
                })
                .error(function(data, status, headers, config) {
                    // do something
                    /* jshint -W015 */
                });
        }

        $scope.propagation = {};  // inherited by the PropagationEditorCtrl

        $scope.activeTab = "general";

        $scope.acc_type_values = acc_type_values;

        $scope.accSelectOptions = {
            minimumInputLength: 1,
            containerCssClass: 'accession-select',
            formatResult: function(object, container, query) {
                return object.code + " - " + object.taxon_str;
            },
            formatSelection: function(object, container) {
                return object.code + " - " + object.taxon_str;
            },

            id: function(obj) {
                return obj.ref; // use ref field for id since our resources don't have ids
            },

            // get the list of families matching the query
            query: function(options){
                // TODO: somehow we need to cache the returned results and early search
                // for new results when the query string is something like .length==2
                // console.log('query: ', options);....i think this is what the
                // options.context is for
                Accession.query(options.term + '%')
                    .success(function(data, status, headers, config) {
                        options.callback({results: data.results});
                    })
                    .error(function(data, status, headers, config) {
                        // do something
                        /* jshint -W015 */
                    });
            }
        };

        $scope.locationSelectOptions = {
            minimumInputLength: 1,
            containerCssClass: 'location-select',
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
                Location.query(options.term + '%')
                    .success(function(data, status, headers, config) {
                        options.callback({results: data.results});
                    })
                    .error(function(data, status, headers, config) {
                        // do something
                        /* jshint -W015 */
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
            $scope.plant.notes = $scope.notes;
            Plant.save($scope.plant)
                .success(function(data, status, headers, config) {
                    console.log('data: ', data);
                    $scope.cancel();
                })
                .error(function(data, status, headers, config) {
                    if(data) {
                        $scope.alerts.push({type: 'error', msg: "Error!\n" + data});
                    } else {
                        $scope.alerts.push({type: 'error', msg: "Unknown error!"});
                    }
                });

        };
    });
