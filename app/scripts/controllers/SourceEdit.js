'use strict';

angular.module('BaubleApp')
    .controller('SourceDetailEditCtrl', function ($scope, $modalInstance, Source) {

        $scope.source_detail = {};

        $scope.sourceTypeOptions = {
            minimumInputLength: 1,
            containerCssClass: "col-lg-10",
        };

        Source.get_schema(true)
            .success(function(data, status, headers, config) {
                $scope.source_types = data.columns.source_type.values;
            })
            .error(function(data, status, headers, config) {
                // do something
            });

        $scope.save = function() {
            Source.save($scope.source_detail)
                .success(function(data, status, headers, config) {
                    $modalInstance.close($scope.data);
                })
                .error(function(data, status, headers, config) {
                    // do something
                });
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    });
