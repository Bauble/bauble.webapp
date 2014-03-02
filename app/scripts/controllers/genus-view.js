'use strict';

angular.module('BaubleApp')
  .controller('GenusViewCtrl', ['$scope', '$location', 'Genus',
    function ($scope, $location, Genus) {

        $scope.genus = $scope.selected;

        Genus.get($scope.genus)
            .success(function(data, status, headers, config) {
                $scope.genus = data;
            })
            .error(function(data, status, headers, config) {
                // do something
                /* jshint -W015 */
            });

        $scope.$on('genus-edit', function(){
            $scope.$apply(function() {
                $location.path('/edit/genus');
            });
        });

        $scope.$on('genus-addtaxon', function(){
            $scope.$apply(function() {
                $location.path('/new/taxon').search({'genus': $scope.genus.ref});
            });
        });

        $scope.counts = {};

        Genus.count($scope.genus, "/taxa")
            .success(function(data, status, headers, config) {
                $scope.counts.taxa = data;
            })
            .error(function(data, status, headers, config) {
                // do something
                /* jshint -W015 */
            });

        Genus.count($scope.genus, "/taxa/accessions")
            .success(function(data, status, headers, config) {
                $scope.counts.accessions = data;
            })
            .error(function(data, status, headers, config) {
                // do something
                /* jshint -W015 */
            });

        Genus.count($scope.genus, "/taxa/accessions/plants")
            .success(function(data, status, headers, config) {
                $scope.counts.plants = data;
            })
            .error(function(data, status, headers, config) {
                // do something
                /* jshint -W015 */
            });

    }]);
