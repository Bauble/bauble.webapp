'use strict';

angular.module('BaubleApp')
    .controller('SearchCtrl', function ($scope, globals, Search, ViewMeta) {
        $scope.viewMeta = null;
        $scope.selected = null;
        $scope.results = null; // the results of the search

        // query the server for search results
        $scope.search = function(q) {
            $scope.results = [];
            if(!q) {
                $scope.alert = "Please enter a search query";
                return;
            } else {
                $scope.alert = null;
            }

            Search.query(q)
                .success(function(data, status, headers, config) {
                    console.log("data: ", data);
                    $scope.results = data.results;
                    if($scope.results.length==0) {
                        $scope.alert = "No results for your search query"
                    }
                })
                .error(function(data, status, headers, config) {
                    console.log("");
                });
        };

        $scope.itemSelected = function(selected) {
            $scope.viewMeta = ViewMeta.getView(selected.ref);
            console.log('selected: ', selected);
            $scope.selected = selected;
            globals.selected = selected;
        };

        $scope.itemExpanded = function() {
            console.log('itemExpanded(');
        };
    });
