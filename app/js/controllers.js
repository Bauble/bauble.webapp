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

    // lookup
    $scope.queryFamily = function(q){
        console.log('queryFamilies: ', q);
        if(!q || q.length < 3)
            return;
        Family.query(q, function(response){
            $scope.families = response.data;
        });
    };
    $scope.families = {}; // the list of completions
    $scope.genus = {};
    $scope.Genus = Genus;
}
GenusCtrl.$inject = ['$scope', 'Family', 'Genus'];


function LoginCtrl() {
}
//LoginCtrl.$inject = [];


function AdminCtrl() {
}
//AdminCtrl.$inject = [];
