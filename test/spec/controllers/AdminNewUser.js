'use strict';

describe('Controller: AdminNewUserCtrl', function () {

    // load the controller's module
    beforeEach(module('BaubleApp'));

    var AdminNewUserCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller) {
        scope = {};
        AdminNewUserCtrl = $controller('AdminNewUserCtrl', {
            $scope: scope
        });
    }));

    // it('should attach a list of awesomeThings to the scope', function () {
    //   expect(scope.awesomeThings.length).toBe(3);
    // });
});
