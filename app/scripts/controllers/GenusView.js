'use strict';

angular.module('BaubleApp')
    .controller('GenusViewCtrl', function ($scope, $location, Genus) {
        $scope.genus = {};

        // get the genus details when the selection is changed
        $scope.$watch('selected', function() {
            Genus.details($scope.selected, function(result) {
                $scope.genus = result.data;
            });
        });

        $scope.$on('genus-edit', function(){
            $scope.$apply(function() {
                $location.path('/edit/genus')
            });
        });

        $scope.$on('genus-addtaxon', function(){
            $scope.$apply(function() {
                $location.path('/new/taxon').search({'genus': $scope.genus.ref});
            });
        });

    });
