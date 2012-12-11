'use strict';

/* Controllers */

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

}
// explicityly inject so minification doesn't doesn't break the controller
SearchCtrl.$inject = ['$scope', 'Search'];


//
// Family controller
//
function FamilyCtrl($scope, Family) {

    $scope.family = {};
    $scope.Family = Family;
}
FamilyCtrl.$inject = ['$scope', 'Family'];


//
// Genus controller
//
function GenusCtrl($scope, Family, Genus) {

    $scope.families = []; // the list of completions
    $scope.family = {};
    $scope.genus = {};
    $scope.Genus = Genus;

    $scope.multiOptions = {
        minimumInputLength: 1,

        // get the list of families matching the query
        query: function(options){
            //console.log('query: ', options);
            Family.query(options.term, function(response){
                //console.log('response: ', response);
                $scope.families = response.data;
                if(response.data && response.data.length > 0)
                    options.callback({results: response.data});
            });
        }
    };

    // seth the family_id on the genus when a family is selected
    $scope.$watch('family', function() {
        $scope.genus.family_id = $scope.family.id;
        console.log('family_id: ', $scope.genus.family_id);
    });
}
GenusCtrl.$inject = ['$scope', 'Family', 'Genus'];


function LoginCtrl() {
}
//LoginCtrl.$inject = [];


function AdminCtrl() {
}
//AdminCtrl.$inject = [];
