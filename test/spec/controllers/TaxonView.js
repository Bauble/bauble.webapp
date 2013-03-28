'use strict';

describe('Controller: TaxonViewCtrl', function () {

  // load the controller's module
  beforeEach(module('BaubleApp'));

  var TaxonViewCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller) {
    scope = {};
    TaxonViewCtrl = $controller('TaxonViewCtrl', {
      $scope: scope
    });
  }));

  // it('should attach a list of awesomeThings to the scope', function () {
  //   expect(scope.awesomeThings.length).toBe(3);
  // });
});
