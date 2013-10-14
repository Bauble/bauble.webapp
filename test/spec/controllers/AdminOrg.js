'use strict';

describe('Controller: AdminOrgCtrl', function () {

    // load the controller's module
    beforeEach(module('BaubleApp'));

    var AdminOrgCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller) {
        scope = {};
        AdminOrgCtrl = $controller('AdminOrgCtrl', {
            $scope: scope
        });
    }));

    // it('should attach a list of awesomeThings to the scope', function () {
    //     expect(scope.awesomeThings.length).toBe(3);
    // });
});
