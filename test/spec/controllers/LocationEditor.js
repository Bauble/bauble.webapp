'use strict';

describe('Controller: LocationEditorCtrl', function () {

  // load the controller's module
  beforeEach(module('BaubleApp'));

  var LocationEditorCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller) {
    scope = {};
    LocationEditorCtrl = $controller('LocationEditorCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
