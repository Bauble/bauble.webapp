'use strict';

describe('Controller: AccessionViewCtrl', function () {

  // load the controller's module
  beforeEach(module('BaubleApp'));

  var AccessionViewCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller) {
    scope = {};
    AccessionViewCtrl = $controller('AccessionViewCtrl', {
      $scope: scope
    });
  }));

  // it('should attach a list of awesomeThings to the scope', function () {
  //   expect(scope.awesomeThings.length).toBe(3);
  // });
});
