'use strict';

describe('Controller: WelcomeCtrl', function () {

  // load the controller's module
  beforeEach(module('BaubleApp'));

  var WelcomeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller) {
    scope = {};
    WelcomeCtrl = $controller('WelcomeCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
