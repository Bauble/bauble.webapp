'use strict';

angular.module('BaubleApp')
    .controller('FamilyViewCtrl', function ($scope, $location, Family) {

        $scope.family = {};
        $scope.Family = Family;

        // get the family details when the selection is changed
        //if($scope.selected) {
            $scope.$watch('selected', function() {
                $scope.Family.details($scope.selected, function(result) {
                    $scope.family = result.data;
                });
            });
        //}

        $scope.onEditorLoaded = function() {
            // remove the template after the dialog is hidden
            var el = $('#familyEditorContainer div').first();
            el.on('hide', function() {
                $scope.editorTemplate = null;
                $scope.showEditor = false;
            });
        };

        $scope.$on('family-edit', function(){
            $location.url('/edit/family');
        });
    });
