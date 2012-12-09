'use strict';

/* Controllers */

function SearchCtrl($scope, Query) {

    // query the server for search results
    $scope.query = function(q) {
        return Query(q, function(response) {
            console.log('response: ', response);
            $scope.results = response.data.results;
        });
    };

    // search results will be in here
    $scope.results = [];

}
// explicityly inject so minification doesn't doesn't break the controller
SearchCtrl.$inject = ['$scope', 'Query'];


//
// Family controller
//
function FamilyCtrl($scope, Family) {

    $scope.family = {};
    $scope.Family = Family;
}
FamilyCtrl.$inject = ['$scope', 'Family'];


function LoginCtrl() {
}
//LoginCtrl.$inject = [];


function AdminCtrl() {
}
//AdminCtrl.$inject = [];
