'use strict';

describe('Controller: NewCtrl', function () {

  // load the controller's module
  beforeEach(module('BaubleApp'));

  var NewCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller) {
    scope = {};
    NewCtrl = $controller('NewCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
