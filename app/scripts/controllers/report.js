'use strict';

// TODO: add map for column names to display names or headers

angular.module('BaubleApp')
    .controller('ReportCtrl', ['$scope', '$location', '$stateParams', 'Alert', 'Search', 'Resource', 'Report',
    function ($scope, $location, $stateParams, Alert, Search, Resource, Report) {

        // object to represent the report table columns
        function TableColumn(name, header, visible){
            this.name = name;
            this.header = header || this.name;
            this.width = null;
            this.visible = visible || false;

            // if header is undefined set to name
            //this.header = typeof this.header === "undefined" ? this.name : this.heade;
        }

        $scope.model = {
            resource: null,
            reports: null,
            report: null,
            showQueryBuilder: true,
            showReportSelector: false,
            tableData: null,
            filters: [{operator: '='}],
            tableColumns: [new TableColumn('str', "Name", true)] // the list of column objects
        };

        // *** FOR TESTING
        // $scope.model.resource = '/family';
        // $scope.model.filters[0] =  { column: 'family', operator: '=', value: 'Orchidaceae' };
        // $scope.model.showReportSelector = false;
        // $scope.model.showQueryBuilder = false;
        // $scope.model.tableData = [{
        //     id: 1,
        //     str: "Orchidiaceae"
        // },{
        //     id: 2,
        //     str: "Fabaceae"
        // }];

        // get the list of saved reports
        Report.list()
            .success(function(data, status, headers, config) {
                $scope.model.reports = data;
                $scope.model.showQueryBuilder = ($scope.model.reports.length === 0);
                $scope.model.showReportSelector = ($scope.model.reports.length > 0);
            })
            .error(function(data, status, headers, config) {
                // do something
              /* jshint -W015 */
            });

        $scope.showReportSelector = true;
        $scope.showQueryBuilder = false;

        $scope.operators =
            { '=':  '=',
              '!=': '!=',
              '<': '<',
              '<=': '<=',
              '>': '>',
              '>=': '>=',
              'like': 'like'
            };

        $scope.domains = [
            { label: 'Family', resource: '/family', result: 'families', sort: 0 },
            { label: 'Genus', resource: '/genus', result: 'genera', sort: 1 },
            { label: 'Taxon', resource: '/taxon', result: 'taxa', sort: 2 },
            { label: 'Accession', resource: '/accession', result: 'accessions',
              sort: 3 },
            { label: 'Plant', resource: '/plant', result: 'plants', sort: 4 },
            { label: 'Location', resource: '/location', result: 'location', sort: 5 }
        ];





        $scope.$watch('model.resource', function(newValue, oldValue) {
            if(oldValue !== newValue && oldValue !== null) {
                alert("Warn the user that the domain is changing!");
            }
            if(newValue === null || typeof newValue === 'undefined') {
                return;
            }

            $scope.model.tableColumns = [new TableColumn('str', "Name", true)];
            console.log('$scope.model.resource: ', $scope.model.resource);
            Resource($scope.model.resource).get_schema(true)
                .success(function(data, status, headers, config) {
                    angular.forEach(data.columns, function(index, value) {
                        $scope.model.tableColumns.push(new TableColumn(value));
                    });

                })
                .error(function(data, status, headers, config) {
                    var defaultMessage = "** Error: Could not get schema for resource.";
                    Alert.onErrorResponse(data, defaultMessage);
                });
        });

        //
        //
        //
        $scope.$watch('model.report', function(report){
            console.log('report: ', report);
            if(!report) {
                return;
            }

            $location.search('id', report.id);

            $scope.model.showQueryBuilder = !!report.query;
            $scope.model.showReportSelector = false;
            return;
            // if(report.query) {
            //     buildQueryModel(report.query);
            // } else {
            //     $scope.model.filters = [{operator: '='}];
            // }
            // $scope.refreshTable();
        });


        //
        //  Set the column for the filter when selected from the schema menu.
        //
        $scope.onFilterSchemaSelect = function($event, column, selected, $index) {
            $scope.model.filters[$index].column = selected;
        };


        $scope.addFilterField = function() {
            // add another row to the list of filters
            $scope.model.filters.push({ boolOp: "and" , operator: '='});
        };

        $scope.validateQuery = function() {
            var valid = $scope.model.filters.length > 0 ? true : false;
            $.each($scope.model.filters, function(index, filter) {
                if(!filter.column || !filter.operator || !filter.value) {
                    valid = false;
                    return false;
                }
            });
            return valid ? "" : "disabled";
        };

        $scope.saveReport = function() {

            // TODO: get the report name if it hasn't already been set

            // TOD: post saved report....where does the report name come from,
            // don't use a modal so it works on touch devices
            Report.save($scope.model.report)
                .success(function(data, status, headers, config) {
                    Alert.add('Report saved.');
                })
                .error(function(data, status, headers, config) {
                    // TODO: if 409 then there's already a report with this name
                    var defaultMessage = "** Error: Could not save the report.";
                    Alert.onErrorResponse(data, defaultMessage);
                });

        };


        //
        // build a query string from a model
        //
        function buildQueryString(domain, filters) {
            var q = domain;
            if(filters.length === 0) {
                q += '=*';
            }
            else {
                q += ' where ';
                angular.forEach(filters, function(filter, index) {
                    if(index > 0) {
                        q += ' ' + filter.boolOp + ' ';
                    }
                    q += [filter.column, filter.operator, filter.value].join(' ');
                });
            }
            return q;
        }

        //
        // build a filters from a query string
        //
        function buildQueryModel(query) {

            var words = query.split(' ');

            console.log('words: ', words);
            var model = {
                resource: '/' + words[0]
            };
            return model;
        }

        $scope.refreshTable = function() {
            // update the table data based on the domain, filters and report fields
            //$resource($scope.model.resource).
            // TODO: build up the query based on the filter fields

            var q = buildQueryString($scope.model.resource.substring(1), $scope.model.filters);
            $scope.model.report.query = q;

            Search.query(q)
                .success(function(data, status, headers, config) {
                    var resultProp = _.find($scope.domains,
                                            {resource: $scope.model.resource}).result;
                    $scope.model.tableData = data[resultProp];
                    $scope.model.message = (!$scope.model.tableData || $scope.model.tableData.length === 0) ? "No results." : "";
                })
                .error(function(data, status, headers, config) {
                    // do something
                    /* jshint -W015 */
                    $scope.model.message = "Error: Could not get results from database";
                });
        };

        $scope.showColButtons = function(event, index)  {
            console.log("hover: ", index);
            $scope.colHover = index;
        };


        $scope.download = function(){
            var row;
            var tableData = $scope.model.tableData;
            var columns = _.chain($scope.model.tableColumns)
                .filter('visible')
                .pluck('name')
                .value();
            var csv = [columns.join(',')];
            console.log('csv: ', csv);
            for(var i=0; i<tableData.length; i++) {
                row = [];
                for(var j=0; j<columns.length; j++) {
                    console.log('csv: ', csv);
                    row.push('"' + tableData[i][columns[j]] + '"');
                }
                csv.push(row.join(','));
            }

            // TODO: this needs to be tested in IE
            // http://stackoverflow.com/questions/17836273/export-javascript-data-to-csv-file-without-server-interaction

            // download the CSV
            var csvString = csv.join('\n');
            var dataUrl = 'data:text/csv,' + encodeURIComponent(csvString);

            // the name doesn't set the filename on most browsers but we use it here anyways
            var name = $scope.model.report.name.replace(' ', '_') + ".csv";
            window.open(dataUrl, name);  //
        };

        $scope.newReport = function() {
            $scope.model.showReportSelector = false;
            $scope.model.showQueryBuilder = true;
            $scope.model.report = {
                name: "New Report",
                query: null,
                settings: {}
            };
        };
    }]);
