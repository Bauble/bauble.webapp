'use strict';

angular.module('BaubleApp')
    .controller('LocationViewCtrl', function ($scope, Location) {
        $scope.Location = Location;
        $scope.location = {};

        // get the taxon details when the selection is changed
        $scope.$watch('selected', function() {
            $scope.Location.details($scope.selected, function(result) {
                $scope.location = result.data;
            });
        });

        $scope.onEditorLoaded = function() {
            // remove the template after the dialog is hidden
            console.log('onEditorLoaded');
            var el = $('#locationEditorContainer div').first();
            el.on('hide', function() {
                $scope.editorTemplate = false;
                //$scope.showEditor = false;
                $scope.testShow = false;

            });
        };

        $scope.$on('location-edit', function(){
            $scope.editorTemplate = $scope.viewMeta['editor'];
            // set this in apply since we're in an event "outside" of angular
            $scope.$apply('showEditor = true');
        });
    });
