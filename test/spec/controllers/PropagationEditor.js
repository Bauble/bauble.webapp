'use strict';

describe('Controller: PropagationEditorCtrl', function () {

  // load the controller's module
  beforeEach(module('BaubleApp'));

  var PropagationEditorCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller) {
    scope = {};
    PropagationEditorCtrl = $controller('PropagationEditorCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
