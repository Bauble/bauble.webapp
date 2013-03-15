'use strict';

describe('Directive: emit', function () {
  beforeEach(module('BaubleApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<data-emit></data-emit>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the dataEmit directive');
  }));
});
