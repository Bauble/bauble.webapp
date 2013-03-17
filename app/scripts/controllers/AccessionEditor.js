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
    .controller('AccessionEditorCtrl', function ($scope, Taxon, Accession) {
        $scope.Accession = Accession;
        $scope.accession = {date_accd: new Date(), date_recvd: new Date()};

        $scope.families = []; // the list of completions
        $scope.id_qualifiers = ["?", "aff.", "cf.", "forsan", "incorrect", "near"];

        $scope.activeTab = "general";

        $scope.modalOptions = {
            dialogClass: 'modal accession-editor'
        };

        $scope.prov_type_values = prov_type_values;
        $scope.wild_prov_status_values = wild_prov_status_values;
        $scope.recvd_type_values = recvd_type_values;

        // get the accession details when the selection is changed
        $scope.$watch('selected', function() {
            if(! $scope.selected) return;
            $scope.Accession.details($scope.selected, function(result) {
                $scope.accession = result.data;
            });
        });

        $scope.taxonSelectOptions = {
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
                Taxon.query(options.term + '%', function(response){
                    $scope.families = response.data.results;
                    if(response.data.results && response.data.results.length > 0)
                        options.callback({results: response.data.results});
                });
            }
        };

        $scope.close = function() {
            window.history.back();
        }

        // called when the save button is clicked on the editor
        $scope.save = function() {
            // TODO: we need a way to determine if this is a save on a new or existing
            // object an whether we whould be calling save or edit
            $scope.Accession.save($scope.accession);
            $scope.close();
        };
    });
