'use strict';

describe('Controller: ContactCtrl', function () {

  // load the controller's module
  beforeEach(module('bauble2App'));

  var ContactCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller) {
    scope = {};
    ContactCtrl = $controller('ContactCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
