'use strict';

describe('Controller: OrgInviteModalCtrl', function () {

  // load the controller's module
  beforeEach(module('BaubleApp'));

    var OrgInviteModalCtrl,
    scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        OrgInviteModalCtrl = $controller('OrgInviteModalCtrl', {
            $scope: scope,
            $modalInstance: {},
            organization: {}
        });
    }));

    it('should do something', function () {
        //expect(scope.awesomeThings.length).toBe(3);
    });
});
