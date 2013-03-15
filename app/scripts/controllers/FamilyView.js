'use strict';

angular.module('BaubleApp')
    .controller('FamilyViewCtrl', function ($scope, Family) {

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
                $scope.editorTemplate = false;
                $scope.showEditor = false;

            });
        };

        $scope.$on('family-edit', function(){
            $scope.editorTemplate = "views/family_editor.html";
            // set this in apply since we're in an event "outside" of angular
            $scope.$apply('showEditor = true');
        });

        $scope.$on('genus-edit', function(){
            console.log('genus0edit');
            $scope.editorTemplate = "views/genus_editor.html";
            // set this in apply since we're in an event "outside" of angular
            $scope.$apply('showEditor = true');
        });

    });
