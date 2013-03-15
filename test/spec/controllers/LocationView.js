'use strict';

describe('Controller: LocationViewCtrl', function () {

  // load the controller's module
  beforeEach(module('BaubleApp'));

  var LocationViewCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller) {
    scope = {};
    LocationViewCtrl = $controller('LocationViewCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
