'use strict';

angular.module('BaubleApp')

    .controller('ReporterCtrl', function ($scope, Search) {
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

        $scope.filters = [{}];
        $scope.tableColumns = [new TableColumn('str')]; // the list of column objects
        $scope.tableData = [];

        $scope.$watch('resource', function(newValue, oldValue) {
            if(oldValue !== newValue && oldValue !== undefined) {
                alert("Warn the user that the domain is changing!");
                $scope.tableColumns = [new TableColumn('str')];
            }

            // if(oldValue !== null || typeof oldValue !== "undefined") {
            //     // get here on initialization and the first time the old value is set
            //     alert("Warn the user that the domain is changing!");
            // }
            if(newValue === null || typeof newValue === 'undefined') {
                return;
            }
        });

        // object to represent the report table columns
        function TableColumn(name, header){
            this.name = name,
            this.header = header,
            this.width = undefined;

            // if header is undefined set to name
            this.header = typeof this.header === "undefined" ? this.name : this.header;
        }

        $scope.$on('schema-column-selected', function(event, element, selected) {
            // ignore the selected event unless this is part of a filter
            if(!element.hasClass('filter-schema-menu')) {
                return;
            }

            var menus = element.parents('.filters-box').find('.filter-schema-menu'),
                index = menus.index(element);
            $scope.filters[index].column = selected;
        });


        $scope.addTableColumn = function() {
            // add a field to the report table
            var selected = $('.fields-schema-menu').attr('data-selected');
            $scope.tableColumns.push(new TableColumn(selected));
            console.log('$scope.tableColumns: ', $scope.tableColumns);
        };

        $scope.addFilterField = function() {
            // add another row to the list of filters
            $scope.filters.push({ boolOp: "and" });
        };

        $scope.validateQuery = function() {
            var valid = $scope.filters.length > 0 ? true : false;
            $.each($scope.filters, function(index, filter) {
                if(!filter.column || !filter.operator || !filter.value) {
                    valid = false;
                    return false;
                }
            });
            return valid ? "" : "disabled";
        }

        $scope.refreshTable = function() {
            // update the table data based on the domain, filters and report fields
            //$resource($scope.resource).
            // TODO: build up the query based on the filter fields

            var q = $scope.resource.substring(1);
            if($scope.filters.length === 0) {
              q += '=*';
            }
            else {
                q += ' where ';
                angular.forEach($scope.filters, function(filter, index) {
                    if(index > 0) {
                        q += ' ' + filter.boolOp + ' ';
                    }
                    q += filter.column + filter.operator + filter.value;
                });
            }

            Search.query(q)
                .success(function(data, status, headers, config) {
                    $scope.tableData = data.results;
                    console.log('$scope.tableData: ', $scope.tableData);
                    $scope.message = !$scope.tableData ? "No results." : "";
                })
                .error(function(data, status, headers, config) {
                    // do something
                    $scope.message = "Error: Could not get results from database";
                });
        };
    });
