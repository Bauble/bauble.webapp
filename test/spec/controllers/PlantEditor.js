'use strict';

describe('Controller: PlantEditorCtrl', function () {

  // load the controller's module
  beforeEach(module('BaubleApp'));

  var PlantEditorCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller) {
    scope = {};
    PlantEditorCtrl = $controller('PlantEditorCtrl', {
      $scope: scope
    });
  }));

  // it('should attach a list of awesomeThings to the scope', function () {
  //   expect(scope.awesomeThings.length).toBe(3);
  // });
});
