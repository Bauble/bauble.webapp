'use strict';

angular.module('BaubleApp')
  .controller('SearchCtrl', ['$scope', '$location', '$state', 'Search', 'ViewMeta',
    function ($scope, $location, $state, Search, ViewMeta) {
        $scope.viewMeta = null;
        $scope.selected = null;
        $scope.results = null; // the results of the search
        $scope.$location = $location;  // so we can $watch it later;
        $scope.query = $location.search().q || '';

        $scope.capitalize = function(str) {
            return str.slice(0,1).toUpperCase() + str.slice(1,str.length);
        };


        // query the server for search results
        $scope.search = function() {
            $scope.results = [];
            if(!$scope.query) {
                $scope.message = "Please enter a search query";
                return;
            }

            $scope.alert = null;
            $location.search('q', $scope.query);

            $scope.message = "Searching....";
            $scope.selected = $scope.viewMeta = $scope.results = null;
            sessionStorage.setItem('current_search', $scope.query);
            Search.query($scope.query)
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

                })
                .error(function(data, status, headers, config) {
                    $scope.message = "";
                });
        };


        // if we were passed a query as a routeParam then initiate a search
        if($scope.query) {
            $scope.search();
        }


        $scope.$watch('$location.search().q', function(q) {
            $scope.query = q;
            $scope.search();
        });

        // $scope.itemSelected = function(group, selected) {
        //     console.log('selected: ', selected);
        //     //console.log($state.get('main.search.summary'));
        //     console.log('main.search.summary.' + group);
        //     var state = $state.get("main.search.summary." + group);
        //     $scope.selected = selected;
        //     state.data.selected = selected;
        //     $state.go('main.search.summary.' + group, {selected: selected}, {reload: false, location : false});
        //     //$state.transitionTo('main.search.summary-' + group, {selected: selected}, {reload: false, location : false});

        // };

        $scope.itemSelected = function(resource, selected) {
            $scope.viewMeta = ViewMeta.getView(resource, selected);
            $scope.selected = selected;
            //globals.setSelected(selected);
        };

        // $scope.itemExpanded = function() {
        //     console.log('itemExpanded(');
        // };

        var current_search = sessionStorage.getItem("current_search");
        if(current_search) {
            $scope.q = current_search;
            $scope.search(current_search);
        }
    }]);
