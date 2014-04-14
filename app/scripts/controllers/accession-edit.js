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

angular.module('BaubleApp')
  .controller('AccessionEditCtrl', ['$scope', '$location', '$modal', '$stateParams', 'Alert', 'Taxon', 'Accession', 'Source', 'overlay',
    function ($scope, $location, $modal, $stateParams, Alert, Taxon, Accession, Source, overlay) {

        $scope.model = {
            accession: {
                taxon_id: $location.search().taxon,
                date_accd: new Date(),
                date_recvd: new Date(),
                source: {}
            },
            taxon: {},
            genus: {},
            qualifierRank: {},
            notes: [{}],
            propagations: [{}],
            verifications: [{}]
        };

        $scope.header = "New Accesion";

        $scope.refreshQualRankCombo = function() {
            $scope.model.qualifier_rank = {
                'genus': $scope.model.genus.genus,
            };

            // TODO: there's probably a more clever way to do this with lodash
            var taxonParts = ['sp', 'sp2', 'infrasp1', 'infrasp2', 'infrasp3'];
            angular.forEach(taxonParts, function(value) {
                if($scope.model.taxon[value]) {
                    $scope.model.qualifier_rank[value] = $scope.model.taxon[value];
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
            overlay('loading...');
            Accession.get($stateParams.id, {embed: ['taxon', 'taxon.genus']})
                .success(function(data, status, headers, config) {
                    $scope.model.accession = data;
                    $scope.model.taxon = data.taxon;
                    $scope.model.genus = data['taxon.genus'];
                    $scope.model.notes = data.notes;

                    $scope.model.sourceDetail = _.pick($scope.model.accession.source,
                                                       ['id','name', 'str']);
                    console.log('$scope.model.sourceDetail: ', $scope.model.sourceDetail);

                    console.log('$scope.model.accession: ', $scope.model.accession);

                    // TODO: we should be showing accession.taxon_str here instead of taxon.str
                    $scope.header = $scope.model.accession.code + ' ' + $scope.model.taxon.str;
                })
                .error(function(data, status, headers, config) {
                    var defaultMessage = "Could not get accession details";
                    Alert.onErrorResponse(data, defaultMessage);
                })
                .finally(function() {
                    overlay.clear();
                });
        } else if($scope.model.accession.taxon_id) {
            overlay('loading');
            Taxon.get($scope.model.accession.taxon_id)
                .success(function(data, status, headers, config) {
                    console.log('data: ', data);
                    $scope.model.taxon = data;
                })
                .error(function(data, status, headers, config) {
                    var defautMessage = 'Could not get the taxon details';
                    Alert.onErrorResponse(data, defaultMessage);
                })
                .finally(function() {
                    overlay.clear();
                });
        }

        $scope.id_qualifiers = ["?", "aff.", "cf.", "forsan", "incorrect", "near"];
        $scope.prov_type_values = prov_type_values;
        $scope.wild_prov_status_values = wild_prov_status_values;
        $scope.recvd_type_values = recvd_type_values;

        $scope.activeTab = "general";

        $scope.getTaxa = function($viewValue) {

            // TODO: we also need to join again the generic name here...maybe now it's
            // a good case for storing the str on save and querying the save string
            // instead of just the columns
            return Taxon.list({filter: {taxa: $viewValue + '%'}})
                .then(function(result) {
                    return result.data;
                });
        };

        $scope.onSelectTaxon = function() {
            $scope.model.accession.taxon_id = angular.isDefined($scope.model.taxon) ?
                $scope.model.taxon.id : null;
        };


        $scope.getSources = function($viewValue) {
            // TODO: we also need to join again the generic name here...maybe now it's
            // a good case for storing the str on save and querying the save string
            // instead of just the columns
            return Source.list({filter: {name: $viewValue + '%'}})
                .then(function(result) {
                    return result.data;
                });
        };



        $scope.formatSourceDetailInput = function() {
            console.log('$scope.source: ', $scope.source);
            console.log('$scope.sourceDetail: ', $scope.sourceDetail);
            return $scope.sourceDetail ? $scope.sourceDetail.str : '';
        };


        $scope.onSelectSourceDetail = function() {
            // console.log('sourceDetail: ', sourceDetail);
            // console.log('$scope.sourceDetail: ', $scope.sourceDetail);
            console.log('$scope.model: ', $scope.model);
            $scope.model.accession.source.id = angular.isDefined($scope.model.sourceDetail) ?
                $scope.model.sourceDetail.id : null;
        };



        $scope.newSource = function() {
            var modalInstance = $modal.open({
                templateUrl: 'views/source-detail-edit.html',
                controller: "SourceDetailEditCtrl"
            });

            modalInstance.result.then(function(sourceDetail) {
                console.log('source_detail: ', sourceDetail);
                $scope.model.sourceDetail = sourceDetail;
                $scope.model.accession.source.id = sourceDetail.id;
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
            // if(!$scope.model.accession.source) {
            //     delete $scope.model.accession.source;
            // }
            console.log('$scope.model: ', $scope.model);

            // copy the date variables to the accession
            angular.forEach(['date_recvd', 'date_accd'], function(value, key) {
                $scope.model.accession[value] = moment($scope.model.accession[value]).format("YYYY-MM-DD");
            });

            Accession.save($scope.model.accession)
                .success(function(data, status, headers, config) {
                    $scope.cancel();
                })
                .error(function(data, status, headers, config) {
                    // do something
                    /* jshint -W015 */
                });
        };
    }]);
