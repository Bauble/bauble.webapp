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

        $scope.onEditorLoaded = function() {
            // remove the template after the dialog is hidden
            console.log('onEditorLoaded');
            var el = $('#genusEditorContainer div').first();
            el.on('hide', function() {
                $scope.editorTemplate = false;
                //$scope.showEditor = false;
                $scope.testShow = false;

            });
        };

        $scope.$on('genus-edit', function(){
            $location.url('/edit/genus');
        });
    });
