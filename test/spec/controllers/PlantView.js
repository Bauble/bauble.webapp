'use strict';

describe('Controller: PlantViewCtrl', function () {

  // load the controller's module
  beforeEach(module('BaubleApp'));

  var PlantViewCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller) {
    scope = {};
    PlantViewCtrl = $controller('PlantViewCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
