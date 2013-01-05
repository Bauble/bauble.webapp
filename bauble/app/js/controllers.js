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
function SearchCtrl($scope, $compile, Search, ViewMeta) {

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

        $scope.selected = selected;
        console.log(selected.resource);
        console.log(ViewMeta);
        var viewMeta = ViewMeta[selected.resource];
        $scope.selectedView = viewMeta.view;

        var buttons = $("#actionButtons");
        buttons.empty();  // remove existing buttons

        // create each of the buttons that will broadcast the event
        angular.forEach(viewMeta.buttons, function(url, name) {
            // TODO: this should probably go in a directive
            var el = '<a role="button" href="' + url + '" class="btn" data-toggle="modal">' + name + '</a>';
            console.log(el);
            buttons.append($compile(el)($scope));
        });
    };

    $scope.itemExpanded = function() {
        console.log('itemExpanded(');
    };
}
// explicityly inject so minification doesn't doesn't break the controller
SearchCtrl.$inject = ['$scope', '$compile', 'Search', 'ViewMeta'];

//
// Controller for Family summary and editor views
//
function FamilyCtrl($scope, Family) {

    // use $scope.selected in case we're inheriting from the SearchCtrl
    $scope.family = $scope.selected || {};
    $scope.Family = Family;

    $scope.qualifiers = ["s. lat.", "s. str."];

    $scope.save = function() {
        // TODO: we need a way to determine if this is a save on a new or existing
        // object an whether we whould be calling save or edit
        $scope.family = $scope.Family.save($scope.family);
        $('#editorModal').modal('hide');
    };

    // watch the selected for changes and update the family accordingly
    $scope.$watch('selected', function() {
        $scope.family = $scope.selected;
    });
}
FamilyCtrl.$inject = ['$scope', 'Family'];


//
// Genus controller
//
function GenusCtrl($scope, Family, Genus) {

    // use $scope.selected in case we're inheriting from the SearchCtrl
    $scope.genus = $scope.selected || {};
    $scope.families = []; // the list of completions
    $scope.family = {};
    $scope.Genus = Genus;

    $scope.multiOptions = {
        minimumInputLength: 1,

        formatResult: function(object, container, query) { return object.str; },
        formatSelection: function(object, container) { return object.str; },

        // get the list of families matching the query
        query: function(options){
            // TODO: somehow we need to cache the returned results and early search
            // for new results when the query string is something like .length==2
             //console.log('query: ', options);
            Family.query(options.term + '%', function(response){
                //console.log('response: ', response);
                $scope.families = response.data;
                if(response.data && response.data.length > 0)
                    options.callback({results: response.data});
            });
        }
    };

    // set the family_id on the genus when a family is selected
    $scope.$watch('family', function() {
        $scope.genus.family_id = $scope.family.id || null;
    });

    // watch the selected for changes and update the genus accordingly
    $scope.$watch('selected', function() {
        $scope.genus = $scope.selected;
    });


    // called when the save button is clicked on the editor
    $scope.save = function() {
        // TODO: we need a way to determine if this is a save on a new or existing
        // object an whether we whould be calling save or edit
        $scope.Genus.save($scope.genus);
        $('#editorModal').modal('hide');
    };
}
GenusCtrl.$inject = ['$scope', 'Family', 'Genus'];


/**
 * Taxon Controller
 */
function TaxonCtrl($scope, Taxon) {
    $scope.taxon = $scope.selected || {};
    $scope.Taxon = Taxon;

     // called when the save button is clicked on the editor
    $scope.save = function() {
        $scope.Taxon.save($scope.taxon);
        $('#editorModal').modal('hide');
    };
}
TaxonCtrl.$inject = ['$scope', 'Taxon'];


/**
 * Accession Controller
 */
function AccessionCtrl($scope, Accession) {
    $scope.accession = $scope.selected || {};
    $scope.Accession = Accession;

    // called when the save button is clicked on the editor
    $scope.save = function() {
        $scope.Accession.save($scope.accession);
        $('#editorModal').modal('hide');
    };
}
AccessionCtrl.$inject = ['$scope', 'Accession'];

/**
 * Plant Controller
 */
function PlantCtrl($scope, Plant) {
    $scope.plant = $scope.selected || {};
    $scope.Plant = Plant;

    // called when the save button is clicked on the editor
    $scope.save = function() {
        $scope.Plant.save($scope.plant);
        $('#editorModal').modal('hide');
    };
}
PlantCtrl.$inject = ['$scope', 'Plant'];

/**
 * Location Controller
 */
function LocationCtrl($scope, Location) {
    $scope.location = $scope.selected || {};
    $scope.Location = Location;

    // called when the save button is clicked on the editor
    $scope.save = function() {
        $scope.Location.save($scope.location);
        $('#editorModal').modal('hide');
    };
}
LocationCtrl.$inject = ['$scope', 'Location'];

/*
 * Generic controller for notes view partial.
 */
function NoteCtrl($scope) {
}
NoteCtrl.$inject = ['$scope'];


function LoginCtrl() {
}
//LoginCtrl.$inject = [];


function AdminCtrl() {
}
//AdminCtrl.$inject = [];
