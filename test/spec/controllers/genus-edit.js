'use strict';

describe('Controller: GenusEditorCtrl', function () {

  // load the controller's module
  beforeEach(module('BaubleApp'));

  var GenusEditorCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller) {
    scope = {};
    GenusEditorCtrl = $controller('GenusEditorCtrl', {
      $scope: scope
    });
  }));

  // it('should attach a list of awesomeThings to the scope', function () {
  //   expect(scope.awesomeThings.length).toBe(3);
  // });
});
