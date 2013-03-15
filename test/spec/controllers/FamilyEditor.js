'use strict';

describe('Controller: FamilyEditorCtrl', function () {

  // load the controller's module
  beforeEach(module('BaubleApp'));

  var FamilyEditorCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller) {
    scope = {};
    FamilyEditorCtrl = $controller('FamilyEditorCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
