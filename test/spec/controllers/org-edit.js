'use strict';

describe('Controller: OrgEditCtrl', function () {

  // load the controller's module
  beforeEach(module('baubleApp'));

  var OrgEditCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OrgEditCtrl = $controller('OrgEditCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
