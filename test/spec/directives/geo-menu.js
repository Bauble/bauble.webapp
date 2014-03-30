'use strict';

describe('Directive: geoMenu', function () {

    // load the directive's module
    beforeEach(module('BaubleApp'));

    var element,
    scope;

    beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
    }));

    it('should do something', inject(function ($compile) {
        element = angular.element('<geo-menu></geo-menu>');
        element = $compile(element)(scope);
        //expect(element.text()).toBe('this is the geoMenu directive');
    }));
});
