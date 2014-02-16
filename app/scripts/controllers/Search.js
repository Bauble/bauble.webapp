'use strict';

angular.module('BaubleApp')
    .controller('SearchCtrl', function ($scope, $location, globals, Search, ViewMeta) {
        $scope.viewMeta = null;
        $scope.selected = null;
        $scope.results = null; // the results of the search
        $scope.query = $location.search().q || '';

        // query the server for search results
        $scope.search = function() {
            $scope.results = [];
            if(!$scope.query) {
                $scope.alert = "Please enter a search query";
                return;
            } else {
                $scope.alert = null;
            }

            $scope.message = "Searching....";
            $scope.selected = $scope.viewMeta = $scope.results = null;
            sessionStorage.setItem('current_search', $scope.query);
            Search.query($scope.query)
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


        // if we were passed a query as a routeParam then initiate a search
        if($scope.query) {
            $scope.search();
        }

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
