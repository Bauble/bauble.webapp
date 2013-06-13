'use strict';

describe('Controller: LogoutCtrl', function () {

  // load the controller's module
  beforeEach(module('bauble2App'));

  var LogoutCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller) {
    scope = {};
    LogoutCtrl = $controller('LogoutCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
