'use strict';

describe('Directive: synonymsForm', function () {

    // load the directive's module
    beforeEach(module('BaubleApp'));

    var element,
    scope;

    beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
    }));

    it('should make hidden element visible', inject(function ($compile) {
        element = angular.element('<synonyms-form></synonyms-form>');
        element = $compile(element)(scope);

    }));
});
