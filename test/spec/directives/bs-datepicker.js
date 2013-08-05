'use strict';

describe('Directive: bsDatepicker', function () {
  beforeEach(module('bauble2App'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<bs-datepicker></bs-datepicker>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the bsDatepicker directive');
  }));
});
