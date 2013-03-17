'use strict';

angular.module('BaubleApp')
  .controller('SearchCtrl', function ($scope, Search, ViewMeta) {
    $scope.viewMeta = null;
    $scope.selected = null;
    $scope.results = []; // the results of the search

    // query the server for search results
    $scope.Search = function(q) {
        console.log('search: ', q);
        return Search(q, function(response) {
            console.log('response: ', response);
            $scope.results = response.data.results;
        });
    };

    $scope.mouseEnterItem = function(event) {
        $(event.target).addClass('search-result-item-hover');
    };

    $scope.mouseLeaveItem = function(event) {
        $(event.target).removeClass('search-result-item-hover');
    };

    $scope.itemSelected = function(selected) {
        $scope.viewMeta = ViewMeta.getView(selected.ref);
        $scope.selected = selected;
    };

    $scope.itemExpanded = function() {
        console.log('itemExpanded(');
    };
  });
