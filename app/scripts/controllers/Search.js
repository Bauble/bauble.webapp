'use strict';

angular.module('BaubleApp')
  .controller('SearchCtrl', ['$scope', '$location', '$state', 'Search', 'ViewMeta',
    function ($scope, $location, $state, Search, ViewMeta) {
        $scope.viewMeta = null;
        $scope.selected = null;
        $scope.results = null; // the results of the search
        $scope.$location = $location;  // so we can $watch it later;

        $scope.capitalize = function(str) {
            return str.slice(0,1).toUpperCase() + str.slice(1,str.length);
        };

        // update the search whenever the q param changes
        $scope.$watch('$location.search().q', function(q) {
            $scope.viewMeta = null;
            $scope.search(q);
        });


        // query the server for search results
        $scope.search = function(query) {
            $scope.loading = true;
            $scope.results = [];

            if(!query) {
                $scope.message = "Please enter a search query";
                return;
            }

            $location.search('q', query);

            $scope.message = "Searching....";
            $scope.selected = $scope.viewMeta = $scope.results = null;

            Search.query(query)
                .success(function(data, status, headers, config) {
                    $scope.results = data;
                    // if($scope.results.length===0) {
                    //     $scope.alert = "No results for your search query";
                    // }
                    $scope.message = "";
                    if(_.size($scope.results) === 0) {
                        $scope.message = "Nothing found.";
                    }
                    $scope.isOpen = _.size($scope.results) === 1 ? true : false;
                    $scope.loading = false;
                })
                .error(function(data, status, headers, config) {
                    $scope.message = "";
                    $scope.loading = false;
                });
        };


        // update the view and current selection whenever a result is selected
        $scope.itemSelected = function(resource, selected) {
            $scope.viewMeta = ViewMeta.getView(resource, selected);
            $scope.selected = selected;
        };
    }]);
