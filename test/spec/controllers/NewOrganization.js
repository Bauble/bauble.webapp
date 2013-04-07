'use strict';

describe('Controller: NewOrganizationCtrl', function () {

  // load the controller's module
  beforeEach(module('BaubleApp'));

  var NewOrganizationCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller) {
    scope = {};
    NewOrganizationCtrl = $controller('NewOrganizationCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
