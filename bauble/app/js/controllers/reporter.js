'use strict';


/* Controllers */

//
// Controller to handle things on the main view page that don't fit elsewhere
//
function ReporterCtrl($scope, $resource) {

    $scope.reportTypes = [
        { name: "Current search", type: 'current' },
        { name: "New Search", type: 'new' },
        { name: "Table", type: 'table' }
    ];
    $scope.reportType = $scope.reportTypes[0];

    $scope.operators =
        { '=':  '=',
          '!=': '!=',
          '<': '<',
          '<=': '<=',
          '>': '>',
          '>=': '>=',
          'like': 'like'
        };

    $scope.domains =
        [
            { label: 'Family', resource: '/family', sort: 0 },
            { label: 'Genus', resource: '/genus', sort: 1 },
            { label: 'Taxon', resource: '/taxon',sort: 2 },
            { label: 'Accession', resource: '/accession',sort: 3 },
            { label: 'Plant', resource: '/plant',sort: 4 },
            { label: 'Location', resource: '/location', sort: 5 }
        ];

    $scope.domainSchema = {};

    $scope.filters = [{}];

    $scope.$watch('resource', function(newValue, oldValue) {
        if(oldValue !== newValue && oldValue !== undefined) {
            alert("Warn the user that the domain is changing!");
        }

        // if(oldValue !== null || typeof oldValue !== "undefined") {
        //     // get here on initialization and the first time the old value is set
        //     alert("Warn the user that the domain is changing!");
        // }
        if(newValue === null || typeof newValue === 'undefined')
            return;

        // get the schema for the new resource
        $resource($scope.resource).get_schema(function(result) {
            console.log('schema: ', result.data);
            $scope.domainSchema = result.data;
        });
    });

    $scope.onFieldClicked = function(event, column) {
        // set the button text to the selected column
        $(event.target).parents('.btn-group').children('.dropdown-toggle').first().text(column);
    };

    $scope.addTableField = function() {
        // add a field to the report table
        var selected = $('.fields-schema-menu').attr('data-selected');
        $(".report-table thead").append("<th>" + selected + "</th>");
    };

    $scope.addFilterField = function() {
        // add another row to the list of filters
        $scope.filters.push({});
    };


    $scope.refreshTable = function() {
        // update the table data based on the domain, filters and report fields
    };
}
ReporterCtrl.$inject = ['$scope', 'Bauble.$resource'];
