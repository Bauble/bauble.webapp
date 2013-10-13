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

            $scope.message = "Searching....";
            $scope.selected = $scope.viewMeta = $scope.results = null;
            console.log("q: ", q);
            sessionStorage.setItem('current_search', q);
            Search.query(q)
                .success(function(data, status, headers, config) {
                    $scope.results = data.results;
                    if($scope.results.length===0) {
                        $scope.alert = "No results for your search query";
                    }
                    $scope.message = "";
                })
                .error(function(data, status, headers, config) {
                    $scope.message = "";
                });
        };

        $scope.itemSelected = function(selected) {
            $scope.viewMeta = ViewMeta.getView(selected.ref);
            console.log('selected: ', selected);
            $scope.selected = selected;
            globals.setSelected(selected);
        };

        $scope.itemExpanded = function() {
            console.log('itemExpanded(');
        };

        var current_search = sessionStorage.getItem("current_search");
        if(current_search) {
            $scope.q = current_search;
            $scope.search(current_search);
        }
    });
