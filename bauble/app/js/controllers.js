'use strict';


/* Controllers */

//
// Controller to handle things on the main view page that don't fit elsewhere
//
function MainCtrl($scope) {

    $scope.showEditor = true;

    var templates = {
        'family': "partials/family_editor.html",
        'genus': "partials/genus_editor.html",
        'taxon': "partials/taxon_editor.html",
        'accession': 'partials/accession_editor.html',
        'plant': 'partials/plant_editor.html',
        'location': 'partials/location_editor.html'
    };

    $scope.newEditor = function(name) {
        $scope.editorTemplate = templates[name];
    };


    $scope.onEditorLoaded = function() {
        // remove the template after the dialog is hidden
        var el = $('#editorContainer div').first();
        el.on('hide', function() {
            $scope.editorTemplate = false;
        });
    };
}
MainCtrl.$inject = ['$scope'];


//
// Controller to handle the searching and search result
//
function SearchCtrl($scope, $compile, globals, Search, ViewMeta) {

    $scope.viewMeta = null;
    $scope.selected = null;
    $scope.results = []; // the results of the search

    // query the server for search results
    $scope.Search = function(q) {
        console.log('search: ', q);
        return Search(q, function(response) {
            console.log('response: ', response);
            $scope.results = response.data.results;
        });
    };

    $scope.mouseEnterItem = function(event) {
        $(event.target).addClass('search-result-item-hover');
    };

    $scope.mouseLeaveItem = function(event) {
        $(event.target).removeClass('search-result-item-hover');
    };

    $scope.itemSelected = function(selected) {
        $scope.viewMeta = ViewMeta[selected.resource];
        $scope.selected = selected;
    };

    $scope.itemExpanded = function() {
        console.log('itemExpanded(');
    };
}
// explicityly inject so minification doesn't doesn't break the controller
SearchCtrl.$inject = ['$scope', '$compile', 'globals', 'Search', 'ViewMeta'];

function FamilyViewCtrl($scope, globals, Family) {

    // can family inherit from the Family View Scaopt
    $scope.family = {};
    $scope.Family = Family;

    // get the family details when the selection is changed
    if($scope.selected) {
        $scope.$watch('selected', function() {
            $scope.Family.details($scope.selected, function(result) {
                $scope.family = result.data;
            });
        });
    }

    $scope.onEditorLoaded = function() {
        // remove the template after the dialog is hidden
        var el = $('#familyEditorContainer div').first();
        el.on('hide', function() {
            $scope.editorTemplate = false;
            $scope.showEditor = false;

        });
    };

    $scope.$on('family-edit', function(){
        $scope.editorTemplate = "partials/family_editor.html";
        // set this in apply since we're in an event "outside" of angular
        $scope.$apply('showEditor = true');
    });


}
FamilyViewCtrl.$inject = ['$scope', 'globals', 'Family'];

//
// Controller for Family summary and editor views
//
function FamilyEditorCtrl($scope, globals, Family) {

    $scope.family = {};
    $scope.Family = Family;

    // get the family details when the selection is changed
    if($scope.selected) {
        $scope.$watch('selected', function() {
            $scope.Family.details($scope.selected, function(result) {
                $scope.family = result.data;
            });
        });
    }

    $scope.activeTab = "general";
    $scope.qualifiers = ["s. lat.", "s. str."];

    $scope.selectOptions = {
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
            Family.query(options.term + '%', function(response){
                $scope.families = response.data.results;
                if(response.data.results && response.data.results.length > 0)
                    options.callback({results: response.data.results});
            });
        }
    };

    $scope.addSynonym = function(synonym) {
        if(!$scope.family.synonyms) {
            $scope.family.synonyms = [synonym];
        } else {
            $scope.family.synonyms.push(synonym);
        }
    };

    $scope.save = function() {
        // TODO: we need a way to determine if this is a save on a new or existing
        // object an whether we whould be calling save or edit

        // TODO: we could probably also update the selected result to reflect
        // any changes in the search result
        $scope.family = $scope.Family.save($scope.family);
        $scope.showModal = false;
    };

}
FamilyEditorCtrl.$inject = ['$scope', 'globals', 'Family'];


//
// Genus controller
//
function GenusViewCtrl($scope, globals, Family, Genus) {

    $scope.Genus = Genus;
    $scope.genus = {};

    // get the genus details when the selection is changed
    $scope.$watch('selected', function() {
        $scope.Genus.details($scope.selected, function(result) {
            $scope.genus = result.data;
        });
    });


    // get the details for the genus since
    $scope.families = []; // the list of completions

    $scope.activeTab = "general";

    $scope.selectOptions = {
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
            Family.query(options.term + '%', function(response){
                $scope.families = response.data.results;
                if(response.data.results && response.data.results.length > 0)
                    options.callback({results: response.data.results});
            });
        }
    };

    // called when the save button is clicked on the editor
    $scope.save = function() {
        // TODO: we need a way to determine if this is a save on a new or existing
        // object an whether we whould be calling save or edit
        $scope.Genus.save($scope.genus);
        $('#editorModal').modal('hide');
    };
}
GenusViewCtrl.$inject = ['$scope', 'globals', 'Family', 'Genus'];

/*
 * Generic controller for notes view partial.
 */
function NotesEditorCtrl($scope) {
    $scope.notes = [];
    $scope.addNote = function() {
        $scope.notes.push({});
    };
}
NotesEditorCtrl.$inject = ['$scope'];


/**
 * Taxon Controller
 */
function TaxonViewCtrl($scope, globals, Taxon) {
    $scope.taxon = globals.selected || {};
    $scope.Taxon = Taxon;

     // called when the save button is clicked on the editor
    $scope.save = function() {
        $scope.Taxon.save($scope.taxon);
        $('#editorModal').modal('hide');
    };
}
TaxonViewCtrl.$inject = ['$scope', 'globals', 'Taxon'];


/**
 * Accession Controller
 */
function AccessionViewCtrl($scope, globals, Accession) {
    $scope.accession = globals.selected || {};
    $scope.Accession = Accession;

    // called when the save button is clicked on the editor
    $scope.save = function() {
        $scope.Accession.save($scope.accession);
        $('#editorModal').modal('hide');
    };
}
AccessionViewCtrl.$inject = ['$scope', 'globals', 'Accession'];

/**
 * Plant Controller
 */
function PlantViewCtrl($scope, globals, Plant) {
    $scope.plant = globals.selected || {};
    $scope.Plant = Plant;

    // called when the save button is clicked on the editor
    $scope.save = function() {
        $scope.Plant.save($scope.plant);
        $('#editorModal').modal('hide');
    };
}
PlantViewCtrl.$inject = ['$scope', 'globals', 'Plant'];

/**
 * Location Controller
 */
function LocationViewCtrl($scope, globals, Location) {
    $scope.location = globals.selected || {};
    $scope.Location = Location;

    // called when the save button is clicked on the editor
    $scope.save = function() {
        $scope.Location.save($scope.location);
        $('#editorModal').modal('hide');
    };
}
LocationViewCtrl.$inject = ['$scope', 'globals', 'Location'];


function LoginCtrl() {
}
//LoginCtrl.$inject = [];


function AdminCtrl() {
}
//AdminCtrl.$inject = [];
