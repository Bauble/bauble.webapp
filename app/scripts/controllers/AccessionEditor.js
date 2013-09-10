'use strict';

var prov_type_values = {
    'Wild': 'Wild',
    'Cultivated': 'Propagule of cultivated wild plant',
    'NotWild': "Not of wild source",
    'InsufficientData': "Insufficient Data",
    'Unknown': "Unknown",
    None: ''};


var wild_prov_status_values = {
    'WildNative': "Wild native",
    'WildNonNative': "Wild non-native",
    'CultivatedNative': "Cultivated native",
    'InsufficientData': "Insufficient Data",
    'Unknown': "Unknown",
    None: ''};


var recvd_type_values = {
    'ALAY': 'Air layer',
    'BBPL': 'Balled & burlapped plant',
    'BRPL': 'Bare root plant',
    'BUDC': 'Bud cutting',
    'BUDD': 'Budded',
    'BULB': 'Bulb',
    'CLUM': 'Clump',
    'CORM': 'Corm',
    'DIVI': 'Division',
    'GRAF': 'Graft',
    'LAYE': 'Layer',
    'PLNT': 'Plant',
    'PSBU': 'Pseudobulb',
    'RCUT': 'Rooted cutting',
    'RHIZ': 'Rhizome',
    'ROOC': 'Root cutting',
    'ROOT': 'Root',
    'SCIO': 'Scion',
    'SEDL': 'Seedling',
    'SEED': 'Seed',
    'SPOR': 'Spore',
    'SPRL': 'Sporeling',
    'TUBE': 'Tuber',
    'UNKN': 'Unknown',
    'URCU': 'Unrooted cutting',
    'BBIL': 'Bulbil',
    'VEGS': 'Vegetative spreading',
    'SCKR': 'Root sucker',
    None: ''
    };

angular.module('BaubleApp')
    .controller('AccessionEditorCtrl', function ($scope, $location, $modal, globals,
                                                 Taxon, Accession, Source) {
        // isNew is inherited from the NewCtrl if this is a /new editor
        $scope.accession = globals.getSelected() && !$scope.isNew ? globals.getSelected() :
            {date_accd: new Date(), date_recvd: new Date()};
        $scope.notes = $scope.accession.notes || [];
        $scope.propagation = {};
        $scope.qualifier_rank = {};

        $scope.$watch(function() { return $scope.accession.taxon }, function() {
            if($scope.accession.taxon && $scope.accession.taxon.ref) {
                Taxon.details($scope.accession.taxon)
                    .success(function(data, status, headers, config) {
                        $scope.qualifier_rank = {
                            'genus': data.genus.genus
                        };
                        angular.forEach(['sp', 'sp2', 'infrasp1', 'infrasp2', 'infrasp3'],
                                        function(value) {
                                            if(data[value]) {
                                                $scope.qualifier_rank[value] = data[value];
                                            }
                                        });
                    })
                    .error(function(data, status, headers, config) {
                        // do something
                    });
            };
        });

        // make sure we have the accession details
        if($scope.accession && angular.isDefined($scope.accession.ref)) {
            Accession.details($scope.accession)
                .success(function(data, status, headers, config) {
                    $scope.accession = data;
                    $scope.notes = $scope.accession.notes || [];
                    $scope.header = $scope.accession.ref ?
                        $scope.accession.code + ' ' + $scope.accession.taxon_str :
                        'New Accession';
                })
                .error(function(data, status, headers, config) {
                    // do something
                });
        } else if($location.search().taxon) {
            Taxon.get($location.search().taxon)
                .success(function(data, status, headers, config) {
                    $scope.accession.taxon = data;
                })
                .error(function(data, status, headers, config) {
                    // do something
                });
        }

        $scope.id_qualifiers = ["?", "aff.", "cf.", "forsan", "incorrect", "near"];
        $scope.prov_type_values = prov_type_values;
        $scope.wild_prov_status_values = wild_prov_status_values;
        $scope.recvd_type_values = recvd_type_values;
        $scope.accession.verifications = $scope.accession.verifications || [{}];

        $scope.activeTab = "general";

        // we need to put a watch on $scope.accession to update this when it changes
        $scope.header = $scope.accession.ref ? $scope.accession.code + ' ' +
            $scope.accession.taxon_str : 'New Accession';

        $scope.taxonSelectOptions = {
            minimumInputLength: 1,
            containerCssClass: 'taxon-select',
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
                Taxon.query(options.term + '%')
                    .success(function(data, status, headers, config) {
                        //$scope. = response.data.results;
                        if(data.results && data.results.length > 0) {
                            options.callback({results: data.results});
                        }
                    })
                    .error(function(data, status, headers, config) {
                        // do something
                    });
            }
        };

        $scope.sourceSelectOptions = {
            minimumInputLength: 1,
            containerCssClass: 'source-select',
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
                Source.query(options.term + '%')
                    .success(function(data, status, headers, config) {
                        //$scope.families = response.data.results;
                        if(data.results && data.results.length > 0) {
                            options.callback({results: data.results});
                        }
                    })
                    .error(function(data, status, headers, config) {
                        // do something
                    });
            }
        };

        $scope.alerts = [];
        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };

        $scope.newSource = function() {
            $modal.open({
                templateUrl: 'views/source_editor.html',
                controller: "SourceEditCtrl"
            })
        };

        $scope.cancel = function() {
            window.history.back();
        };

        // called when the save button is clicked on the editor
        $scope.save = function() {
            // TODO: we need a way to determine if this is a save on a new or existing
            // object an whether we whould be calling save or edit
            if(!$scope.accession.source) {
                delete $scope.accession.source;
            }

            // copy the date variables to the accession
            angular.forEach(['date_recvd', 'date_accd'], function(value, key) {
                $scope.accession[value] = moment($scope.accession[value]).format("YYYY-MM-DD");
            });

            Accession.save($scope.accession)
                .success(function(data, status, headers, config) {
                    $scope.cancel();
                })
                .error(function(data, status, headers, config) {
                    // do something
                });
        };
    });
