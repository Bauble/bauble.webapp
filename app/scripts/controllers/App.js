'use strict';

angular.module('BaubleApp')
    .controller('AppCtrl', function ($scope, ViewMeta) {

        $scope.newEditor = function(name) {
            $scope.editorTemplate = ViewMeta[name].editor;
            $scope.showEditor = true;
        };

        $scope.onEditorLoaded = function() {
            // remove the template after the dialog is hidden
            var el = $('#editorContainer div').first();
            el.on('hide', function() {
                $scope.editorTemplate = false;
            });
        };
    });
