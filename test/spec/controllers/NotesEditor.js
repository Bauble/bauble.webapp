'use strict';

describe('Controller: NotesEditorCtrl', function () {

  // load the controller's module
  beforeEach(module('BaubleApp'));

  var NotesEditorCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller) {
    scope = {};
    NotesEditorCtrl = $controller('NotesEditorCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
