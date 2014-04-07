'use strict';

describe('Controller: AcceptInvitationCtrl', function () {

    // load the controller's module
    beforeEach(module('BaubleApp'));

    var AcceptInvitationCtrl,
    scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        AcceptInvitationCtrl = $controller('AcceptInvitationCtrl', {
            $scope: scope
        });
    }));

    it('should do something', function () {
        //expect(scope.awesomeThings.length).toBe(3);
    });
});
