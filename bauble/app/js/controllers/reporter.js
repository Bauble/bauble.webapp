'use strict';


/* Controllers */

//
// Controller to handle things on the main view page that don't fit elsewhere
//
function ReporterCtrl($scope) {

    $scope.reportTypes = [
        { name: "Current search", type: 'current' },
        { name: "New Search", type: 'new' },
        { name: "Table", type: 'table' }
    ];
    $scope.reportType = $scope.reportTypes[0];
}
ReporterCtrl.$inject = ['$scope'];
