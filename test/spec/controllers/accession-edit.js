'use strict';

describe('Controller: AccessionEditorCtrl', function () {

  // load the controller's module
  beforeEach(module('BaubleApp'));

  var AccessionEditorCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller) {
    scope = {};
    AccessionEditorCtrl = $controller('AccessionEditorCtrl', {
      $scope: scope
    });
  }));

  // it('should attach a list of awesomeThings to the scope', function () {
  //   expect(scope.awesomeThings.length).toBe(3);
  // });
});
