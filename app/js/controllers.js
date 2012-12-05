'use strict';

/* Controllers */

function SearchCtrl() {
    $scope.query = "";
    $scope.results = [];
}
// explicityly inject so minification doesn't doesn't break the controller
SearchCtrl.$inject = ['$scope']


function LoginCtrl() {
}
//LoginCtrl.$inject = [];


function AdminCtrl() {
}
//AdminCtrl.$inject = [];
