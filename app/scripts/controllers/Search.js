'use strict';

angular.module('BaubleApp')
    .controller('SearchCtrl', function ($scope, globals, Search, ViewMeta) {
        $scope.viewMeta = null;
        $scope.selected = null;
        $scope.results = []; // the results of the search

        // query the server for search results
        $scope.search = function(q) {
            if(!q) {
                $scope.alert = "Please enter a search query";
                return;
            } else {
                $scope.alert = null;
                $sco
            }
            Search.query(q)
                .success(function(data, status, headers, config) {
                    console.log("data: ", data);
                    $scope.results = data.results;
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
