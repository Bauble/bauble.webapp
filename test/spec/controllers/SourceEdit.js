'use strict';

describe('Controller: SourceEditCtrl', function () {

  // load the controller's module
  beforeEach(module('BaubleApp'));

  var SourceEditCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller) {
    scope = {};
    SourceEditCtrl = $controller('SourceEditCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
