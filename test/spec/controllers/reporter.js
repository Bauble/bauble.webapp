'use strict';

describe('Controller: ReporterCtrl', function () {

  // load the controller's module
  beforeEach(module('BaubleApp'));

  var ReporterCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller) {
    scope = {};
    ReporterCtrl = $controller('ReporterCtrl', {
      $scope: scope
    });
  }));

  // it('should attach a list of awesomeThings to the scope', function () {
  //   expect(scope.awesomeThings.length).toBe(3);
  // });
});
