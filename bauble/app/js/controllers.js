'use strict';

/* Controllers */

//
// Controller to handle things on the main view page that don't fit elsewhere
//
function MainCtrl($scope) {
    $scope.selectedEditor = null;
}

//
// Controller to handle the searching and search result
//
function SearchCtrl($scope, Search) {

    // query the server for search results
    $scope.Search = function(q) {
        return Search(q, function(response) {
            console.log('response: ', response);
            $scope.results = response.data.results;
        });
    };

    // search results will be in here
    $scope.results = [];

    $scope.summaries = {
        'family': 'partials/family_summary.html',
        'genus': 'partials/genus_summary.html'
    };

    $scope.editors = {
        'family': 'partials/family_editor.html',
        'genus': 'partials/genus_editor.html'
    };

    $scope.summary = "";
    $scope.editor = "";

    $scope.itemSelected = function(selected) {
        $scope.selected = selected;
        if (selected.resource in $scope.summaries) {
            $scope.summary = $scope.summaries[selected.resource];
            console.log("summary: ", $scope.summary);
        } else {
            // TODO: we need some type of of default view for objects
            // that don't have summaries
        }

        if (selected.resource in $scope.editors) {
            $scope.editor = $scope.editors[selected.resource];
            console.log("editor:" , $scope.editor);
        } else {
            // TODO: disable or hide edit button
        }
    };

    $scope.itemExpanded = function() {
        console.log('itemExpanded(');
    };

}
// explicityly inject so minification doesn't doesn't break the controller
SearchCtrl.$inject = ['$scope', 'Search'];


//
// Controller for Family summary and editor views
//
function FamilyCtrl($scope, Family) {

    // use $scope.selected in case we're inheriting from the SearchCtrl
    $scope.family = $scope.selected || {};
    $scope.Family = Family;

    $scope.save = function() {
        // TODO: we need a way to determine if this is a save on a new or existing
        // object an whether we whould be calling save or edit
        console.log('save');
        $scope.Family.save($scope.family);
    };
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

    // called when the save button is clicked on the editor
    $scope.save = function() {
        // TODO: we need a way to determine if this is a save on a new or existing
        // object an whether we whould be calling save or edit
        console.log('save');
        $scope.Genus.save($scope.genus);
    };
}
GenusCtrl.$inject = ['$scope', 'Family', 'Genus'];


function LoginCtrl() {
}
//LoginCtrl.$inject = [];


function AdminCtrl() {
}
//AdminCtrl.$inject = [];
