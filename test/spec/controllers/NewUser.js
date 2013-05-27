'use strict';

describe('Controller: NewUserCtrl', function () {

  // load the controller's module
  beforeEach(module('BaubleApp'));

  var NewUserCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller) {
    scope = {};
    NewUserCtrl = $controller('NewUserCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
