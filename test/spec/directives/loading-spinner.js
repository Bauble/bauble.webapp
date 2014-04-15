'use strict';

describe('Directive: loadingSpinner', function () {

    // load the directive's module
    beforeEach(module('BaubleApp'));

    var element,
    scope;

    beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
    }));

    it('should do something', inject(function ($compile) {
        element = angular.element('<a loading-spinner="false"></a>');
        element = $compile(element)(scope);
        // expect(element.text()).toBe('this is the loadingSpinner directive');
    }));
});
