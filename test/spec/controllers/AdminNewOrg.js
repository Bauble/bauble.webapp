'use strict';

describe('Controller: AdminNewOrgCtrl', function () {

  // load the controller's module
  beforeEach(module('bauble2App'));

  var AdminNewOrgCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller) {
    scope = {};
    AdminNewOrgCtrl = $controller('AdminNewOrgCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
