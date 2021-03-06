'use strict';

describe('Controller: SettingsCtrl', function () {

    // load the controller's module
    beforeEach(module('BaubleApp'));

    var SettingsCtrl,
    scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, User) {
        scope = $rootScope.$new();
        User.local({
            organization_id: 1
        });

        SettingsCtrl = $controller('SettingsCtrl', {
            $scope: scope,
            User: User
        });
    }));

    it('should do something', function () {
        //expect(scope.awesomeThings.length).toBe(3);
    });
});
