'use strict';

describe('Controller: ForgotPasswordCtrl', function () {

    // load the controller's module
    beforeEach(module('BaubleApp'));

    var ForgotPasswordCtrl,
    scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        ForgotPasswordCtrl = $controller('ForgotPasswordCtrl', {
            $scope: scope
        });
    }));

    it('should do something', function () {
        //expect(scope.awesomeThings.length).toBe(3);
    });
});
