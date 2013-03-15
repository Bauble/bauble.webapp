'use strict';

describe('Controller: GenusViewCtrl', function () {

  // load the controller's module
  beforeEach(module('BaubleApp'));

  var GenusViewCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller) {
    scope = {};
    GenusViewCtrl = $controller('GenusViewCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
