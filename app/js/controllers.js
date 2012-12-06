'use strict';

/* Controllers */

function SearchCtrl($scope, Query) {
    $scope.query = "";
    $scope.results = [];
}
// explicityly inject so minification doesn't doesn't break the controller
SearchCtrl.$inject = ['$scope', '$http', 'Query'];


function LoginCtrl() {
}
//LoginCtrl.$inject = [];


function AdminCtrl() {
}
//AdminCtrl.$inject = [];
