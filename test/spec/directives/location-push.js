'use strict';

describe('Directive: locationPush', function () {

    // load the directive's module
    beforeEach(module('BaubleApp'));

    var element,
    scope;

    beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
    }));

    it('should do something', inject(function ($compile) {
        element = angular.element('<a location-push></a>');
        element = $compile(element)(scope);
        //expect(element.text()).toBe('this is the locationPush directive');
    }));
});
