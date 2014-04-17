'use strict';

describe('Controller: TaxonEditorCtrl', function () {

  // load the controller's module
  beforeEach(module('BaubleApp'));

  var TaxonEditorCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller) {
    scope = {};
    TaxonEditorCtrl = $controller('TaxonEditorCtrl', {
      $scope: scope
    });
  }));

  // it('should attach a list of awesomeThings to the scope', function () {
  //   expect(scope.awesomeThings.length).toBe(3);
  // });
});
