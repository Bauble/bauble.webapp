'use strict';

angular.module('BaubleApp')
    .controller('AppCtrl', function ($scope) {
        $scope.showEditor = false;

        var templates = {
            // TODO: get the views from ViewMeta
            'family': "views/family_editor.html",
            'genus': "views/genus_editor.html",
            'taxon': "views/taxon_editor.html",
            'accession': 'views/accession_editor.html',
            'plant': 'views/plant_editor.html',
            'location': 'views/location_editor.html'
        };

        $scope.newEditor = function(name) {
            $scope.editorTemplate = templates[name];
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
