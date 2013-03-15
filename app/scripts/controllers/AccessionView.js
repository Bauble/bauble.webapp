'use strict';

angular.module('BaubleApp')
    .controller('AccessionViewCtrl', function ($scope, Accession) {
        $scope.Accession = Accession;
        $scope.accession = {};

        // get the taxon details when the selection is changed
        $scope.$watch('selected', function() {
            $scope.Accession.details($scope.selected, function(result) {
                $scope.accession = result.data;
            });
        });

        $scope.onEditorLoaded = function() {
            // remove the template after the dialog is hidden
            console.log('onEditorLoaded');
            var el = $('#accessionEditorContainer div').first();
            el.on('hide', function() {
                $scope.editorTemplate = false;
                //$scope.showEditor = false;
                $scope.testShow = false;

            });
        };

        $scope.$on('accession-edit', function(){
            $scope.editorTemplate = $scope.viewMeta['editor'];
            // set this in apply since we're in an event "outside" of angular
            $scope.$apply('showEditor = true');
        });
    });
