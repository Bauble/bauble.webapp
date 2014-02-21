'use strict';

angular.module('BaubleApp')
    .controller('NotesEditorCtrl', function ($scope, Auth) {
        //$scope.notes = [];
        return;

        $scope.addNote = function() {
            return;
            $scope.notes.push({
                user: Auth.getUser().username,
                date: new Date()
            });
        };

        if($scope.notes.length === 0) {
            $scope.addNote();
        }

        $scope.noteTitle = function(note){
            return [note.user, note.date, note.category].join(' - ');
        };

        $scope.dateOptions = {

        };
    });
