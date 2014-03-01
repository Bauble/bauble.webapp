'use strict';

var prov_type_values = {
    'Wild': 'Wild',
    'Cultivated': 'Propagule of cultivated wild plant',
    'NotWild': "Not of wild source",
    'InsufficientData': "Insufficient Data",
    'Unknown': "Unknown",
    None: ''
};


var wild_prov_status_values = {
    'WildNative': "Wild native",
    'WildNonNative': "Wild non-native",
    'CultivatedNative': "Cultivated native",
    'InsufficientData': "Insufficient Data",
    'Unknown': "Unknown",
    None: ''
};


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

angular.module('BaubleApp').controller('AccessionEditCtrl',
    function ($scope, $location, $modal, $stateParams, Taxon, Accession, Source) {
        // isNew is inherited from the NewCtrl if this is a /new editor
        //$scope.accession = globals.getSelected() && !$scope.isNew ? globals.getSelected() : {date_accd: new Date(), date_recvd: new Date()};
        $scope.accession = {
            taxon_id: $location.search().taxon,
            date_accd: new Date(),
            date_recvd: new Date()
        };

        $scope.notes = $scope.accession.notes || [];
        $scope.propagation = {};
        $scope.source = $scope.source || {};
        $scope.qualifier_rank = {};

        $scope.refreshQualRankCombo = function() {
            $scope.qualifier_rank = {
                'genus': $scope.genus.genus,
            };

            // TODO: there's probably a more clever way to do this with lodash
            var taxonParts = ['sp', 'sp2', 'infrasp1', 'infrasp2', 'infrasp3'];
            angular.forEach(taxonParts, function(value) {
                if($scope.taxon[value]) {
                    $scope.qualifier_rank[value] = $scope.taxon[value];
                }
            });
        };


        // ** TODO: this builds the qualifier rank combo based on the taxon name

        // $scope.$watch(function() { return $scope.accession.taxon; }, function() {
        //     if($scope.accession.taxon && $scope.accession.taxon.ref) {
        //         Taxon.details($scope.accession.taxon)
        //             .success(function(data, status, headers, config) {
        //                 $scope.qualifier_rank = {
        //                     'genus': data.genus.genus
        //                 };
        //                 angular.forEach(['sp', 'sp2', 'infrasp1', 'infrasp2', 'infrasp3'],
        //                                 function(value) {
        //                                     if(data[value]) {
        //                                         $scope.qualifier_rank[value] = data[value];
        //                                     }
        //                                 });
        //             })
        //             .error(function(data, status, headers, config) {
        //                 // do something
        //                 /* jshint -W015 */
        //             });
        //     }
        // });

        // make sure we have the accession details
        if($stateParams.id) {
            Accession.get($stateParams.id, {embed: ['taxon', 'taxon.genus']})
                .success(function(data, status, headers, config) {
                    $scope.accession = data;
                    $scope.taxon = data.taxon;
                    $scope.genus = data['taxon.genus'];
                    $scope.notes = data.notes;
                    $scope.header = $scope.accession.ref ?
                        $scope.accession.code + ' ' + $scope.accession.taxon_str :
                        'New Accession';
                })
                .error(function(data, status, headers, config) {
                    // do something
                    /* jshint -W015 */
                });
        } else if($scope.accession.taxon_id) {
            Taxon.get($scope.accession.taxon_id)
                .success(function(data, status, headers, config) {
                    console.log('data: ', data);
                    $scope.taxon = data;
                })
                .error(function(data, status, headers, config) {
                    // do something
                    /* jshint -W015 */
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

        $scope.getTaxa = function($viewValue) {

            // TODO: we also need to join again the generic name here...maybe now it's
            // a good case for storing the str on save and querying the save string
            // instead of just the columns
            return Taxon.list({filter: {taxa: $viewValue + '%'}})
                .then(function(result) {
                    return result.data;
                });
        };

        $scope.formatTaxonInput = function() {
            return $scope.taxon ? $scope.taxon.str : '';
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
                        if(data.results && data.results.length > 0) {
                            options.callback({results: data.results});
                        }
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

        $scope.newSource = function() {
            var modalInstance = $modal.open({
                templateUrl: 'views/source_detail_editor.html',
                controller: "SourceDetailEditCtrl"
            });

            modalInstance.result.then(function(source_detail) {
                if(!$scope.accession.source) {
                    $scope.accession.source = {};
                }
                $scope.source.source_detail = source_detail;
            }, function() {
                console.log('dismissed');
            });
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
                    /* jshint -W015 */
                });
        };
    });
