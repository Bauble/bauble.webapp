'use strict';

describe('Controller: FamilyViewCtrl', function () {

  // load the controller's module
  beforeEach(module('BaubleApp'));

  var FamilyViewCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller) {
    scope = {};
    FamilyViewCtrl = $controller('FamilyViewCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
