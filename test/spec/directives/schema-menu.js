'use strict';

describe('Directive: schemaMenu', function () {
  beforeEach(module('BaubleApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<schema-menu></schema-menu>');
    element = $compile(element)($rootScope);
    //expect(element.text()).toBe('this is the schemaMenu directive');
  }));
});
