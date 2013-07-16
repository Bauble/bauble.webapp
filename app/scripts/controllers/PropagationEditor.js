'use strict';

angular.module('BaubleApp')
  .controller('PropagationEditorCtrl', function ($scope) {

    // the $scope.propagation property should be inherited from the parent scope since
    // this is a "sub-editor"

    $scope.propagation_views = {
        "Seed": "views/prop_seed.html",
        "UnrootedCutting": "views/prop_cutting.html",
        "Other": null
    };
  });
