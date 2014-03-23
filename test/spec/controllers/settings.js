'use strict';

describe('Controller: SettingsCtrl', function () {

    // load the controller's module
    beforeEach(module('BaubleApp'));

    var SettingsCtrl,
    scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        SettingsCtrl = $controller('SettingsCtrl', {
            $scope: scope
        });
    }));

    it('should do something', function () {
        //expect(scope.awesomeThings.length).toBe(3);
    });
});
