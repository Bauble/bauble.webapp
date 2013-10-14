'use strict';

describe('Directive: bsDatepicker', function () {
    beforeEach(module('BaubleApp'));

    var element;

    it('should make hidden element visible', inject(function ($rootScope, $compile) {
        element = angular.element('<bs-datepicker></bs-datepicker>');
        element = $compile(element)($rootScope);
        expect(element.text()).toBe('');
    }));
});
