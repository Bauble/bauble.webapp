'use strict';

angular.module('BaubleApp')
    .controller('GenusViewCtrl', function ($scope, $location, Genus) {

        $scope.Genus = Genus;
        $scope.genus = {};

        // get the genus details when the selection is changed
        $scope.$watch('selected', function() {
            $scope.Genus.details($scope.selected, function(result) {
                $scope.genus = result.data;
            });
        });

        $scope.$on('genus-edit', function(){
            $scope.$apply(function() {
                $location.path('/edit/genus')
            });
        });
    });
