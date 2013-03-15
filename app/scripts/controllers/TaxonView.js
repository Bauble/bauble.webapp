'use strict';

angular.module('BaubleApp')
    .controller('TaxonViewCtrl', function ($scope, Taxon) {
        $scope.Taxon = Taxon;
        $scope.taxon = {};

        // get the taxon details when the selection is changed
        $scope.$watch('selected', function() {
            $scope.Taxon.details($scope.selected, function(result) {
                $scope.taxon = result.data;
            });
        });

        $scope.onEditorLoaded = function() {
            // remove the template after the dialog is hidden
            console.log('onEditorLoaded');
            var el = $('#taxonEditorContainer div').first();
            el.on('hide', function() {
                $scope.editorTemplate = false;
                //$scope.showEditor = false;
                $scope.testShow = false;

            });
        };

        $scope.$on('taxon-edit', function(){
            $scope.editorTemplate = $scope.viewMeta['editor'];
            // set this in apply since we're in an event "outside" of angular
            $scope.$apply('showEditor = true');
        });
    });
