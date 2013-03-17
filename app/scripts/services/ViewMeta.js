'use strict';

angular.module('BaubleApp')
    .factory('ViewMeta',
        ['FamilyView', 'GenusView', 'TaxonView', 'AccessionView', 'PlantView', 'LocationView',
            function(FamilyView, GenusView, TaxonView, AccessionView, PlantView, LocationView) {
        return {
            getView: function(ref)  {
                // allow get the view based on the ref
                switch(true) {
                    case /\/family/.test(ref):
                        return FamilyView;
                        break
                    case /\/genus/.test(ref):
                        return GenusView;
                        break
                    case /\/taxon/.test(ref):
                        return TaxonView;
                        break
                    case /\/accession/.test(ref):
                        return AccessionView;
                        break
                    case /\/plant/.test(ref):
                        return PlantView;
                        break
                    case /\/location/.test(ref):
                        return LocationView;
                        break
                    default:
                        return null;
                        break;
                }
            },
            'family': FamilyView,
            'genus': GenusView,
            'taxon': TaxonView,
            'accession': AccessionView,
            'plant': PlantView,
            'location': LocationView
        };
    }])

    .factory('FamilyView', [function() {
        return {
            editor: "views/family_editor.html",
            view: "views/family_view.html",

            buttons: [
                { name: "Edit", event: "family-edit" },
                { name: "Add Genus", event: "family-addgenus" }, // add genus to selected Family,
                { name: "Delete", event: "family-delete"} // delete the selected Family
            ]
        };
    }])

    .factory('GenusView', [function() {
        return {
            editor: "views/genus_editor.html",
            view: "views/genus_view.html",

            buttons: [
                { name: "Edit", event: "genus-edit" },
                { name: "Add Taxon", event: "genus-addtaxon" }, // add Taxon to selected Genus
                { name: "Delete", event: "genus-delete" }  // delete the selected Genus
            ]
        };
    }])

    .factory('TaxonView', [function() {
        return {
            editor: "views/taxon_editor.html",
            view: "views/taxon_view.html",

            buttons: [
                { name: "Edit", event: "taxon-edit" },
                { name: "Add Accession", event: "taxon-addaccession" }, // add accession to selected Taxon
                { name: "Delete", event: "taxon-delete" } // delete the selected Taxon
            ]
        };
    }])

    .factory('AccessionView', [function() {
        return {
            editor: "views/accession_editor.html",
            view: "views/accession_view.html",

            buttons: [
                { name: "Edit", event: "accession-edit" },
                { name: "Add Plant", event: 'accession-addplant' }, // add plant to selected Accession,
                { name: "Delete",  event: 'accession-delete' } // delete the selected Accession
            ]
        };
    }])

    .factory('PlantView', [function() {
        return {
            editor: "views/plant_editor.html",
            view: "views/plant_view.html",
            buttons: [
                { name: "Edit", event: 'plant-edit' },
                { name: "Delete", event: 'plant-delete' } // delete the selected Plant
            ]
        };
    }])

    .factory('LocationView', [function() {
        return {
            editor: "views/location_editor.html",
            view: "views/location_view.html",
            buttons: [
                { name: "Edit", event: 'location-edit' },
                { name: "Delete", event: 'location-delete' } // delete the selected Location
            ]
        };
    }]);
