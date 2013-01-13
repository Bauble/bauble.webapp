'use strict';

/* Controllers */

//
// Controller to handle things on the main view page that don't fit elsewhere
//
function MainCtrl($scope) {

}
MainCtrl.$inject = ['$scope'];


function EditorCtrl($scope, $route, ViewMeta) {
    $scope.editor = ViewMeta[$route.current.params.resource].editor;
    $('#editorModal').modal('show');

    // TODO: we should store the locatio nand when the modal editor is closed
}
EditorCtrl.$inject = ['$scope', '$route', 'ViewMeta'];

//
// Controller to handle the searching and search result
//
function SearchCtrl($scope, $compile, globals, Search, ViewMeta) {

    // query the server for search results
    $scope.Search = function(q) {
        return Search(q, function(response) {
            console.log('response: ', response);
            $scope.results = response.data.results;
        });
    };

    // search results will be in here
    $scope.results = [];

    $scope.itemSelected = function(selected) {
        // TODO: should we remove any existing event handles from old controllers
        globals.selected = selected;
        console.log('view: ', ViewMeta);
        var viewMeta = ViewMeta[selected.resource];
        $scope.selectedView = viewMeta.view;

        var buttons = $("#actionButtons");
        buttons.empty();  // remove existing buttons

        // create each of the buttons that will broadcast the event
        angular.forEach(viewMeta.buttons, function(url, name) {
            // TODO: this should probably go in a directive
            var el = '<a role="button" href="' + url + '" class="btn" data-toggle="modal">' + name + '</a>';
            buttons.append($compile(el)($scope));
        });
    };

    $scope.itemExpanded = function() {
        console.log('itemExpanded(');
    };
}
// explicityly inject so minification doesn't doesn't break the controller
SearchCtrl.$inject = ['$scope', '$compile', 'globals', 'Search', 'ViewMeta'];

//
// Controller for Family summary and editor views
//
function FamilyCtrl($scope, globals, Family) {

    $scope.family = globals.selected || {};
    $scope.Family = Family;
    $scope.activeTab = "general";

    // TODO: first test if family has notes and if not add them
    //$scope.notes = $scope.family.notes

    $scope.qualifiers = ["s. lat.", "s. str."];

    $scope.save = function() {
        // TODO: we need a way to determine if this is a save on a new or existing
        // object an whether we whould be calling save or edit

        // TODO: we could probably also update the selected result to reflect
        // any changes in the search result
        $scope.family = $scope.Family.save($scope.family);
        $('#editorModal').modal('hide');
    };

}
FamilyCtrl.$inject = ['$scope', 'globals', 'Family'];


//
// Genus controller
//
function GenusCtrl($scope, globals, Family, Genus) {

    $scope.Genus = Genus;
    $scope.genus = {};

    // TODO: just because a global is selected doesn't necessarily mean we
    // want to use it...maybe we clicked the New button but something is selected
    if(globals.selected) {
        // get the details for the genus
        $scope.Genus.details(globals.selected, function(result) {
            $scope.genus = result.data;
        });
    }
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
                    console.log('call callback: ');
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
GenusCtrl.$inject = ['$scope', 'globals', 'Family', 'Genus'];

/*
 * Generic controller for notes view partial.
 */
function NotesEditorCtrl($scope) {
    $scope.notes = [];
    $scope.addNote = function() {
        console.log('add Note');
        $scope.notes.push({user: 'brett'});
        console.log('$scope.notes: ', $scope.notes);
    };
}
NotesEditorCtrl.$inject = ['$scope'];


/**
 * Taxon Controller
 */
function TaxonCtrl($scope, globals, Taxon) {
    $scope.taxon = globals.selected || {};
    $scope.Taxon = Taxon;

     // called when the save button is clicked on the editor
    $scope.save = function() {
        $scope.Taxon.save($scope.taxon);
        $('#editorModal').modal('hide');
    };
}
TaxonCtrl.$inject = ['$scope', 'globals', 'Taxon'];


/**
 * Accession Controller
 */
function AccessionCtrl($scope, globals, Accession) {
    $scope.accession = globals.selected || {};
    $scope.Accession = Accession;

    // called when the save button is clicked on the editor
    $scope.save = function() {
        $scope.Accession.save($scope.accession);
        $('#editorModal').modal('hide');
    };
}
AccessionCtrl.$inject = ['$scope', 'globals', 'Accession'];

/**
 * Plant Controller
 */
function PlantCtrl($scope, globals, Plant) {
    $scope.plant = globals.selected || {};
    $scope.Plant = Plant;

    // called when the save button is clicked on the editor
    $scope.save = function() {
        $scope.Plant.save($scope.plant);
        $('#editorModal').modal('hide');
    };
}
PlantCtrl.$inject = ['$scope', 'globals', 'Plant'];

/**
 * Location Controller
 */
function LocationCtrl($scope, globals, Location) {
    $scope.location = globals.selected || {};
    $scope.Location = Location;

    // called when the save button is clicked on the editor
    $scope.save = function() {
        $scope.Location.save($scope.location);
        $('#editorModal').modal('hide');
    };
}
LocationCtrl.$inject = ['$scope', 'globals', 'Location'];


function LoginCtrl() {
}
//LoginCtrl.$inject = [];


function AdminCtrl() {
}
//AdminCtrl.$inject = [];
