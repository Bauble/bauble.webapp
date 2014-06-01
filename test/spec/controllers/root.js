'use strict';

describe('Controller: RootCtrl', function () {

    // load the controller's module
    beforeEach(module('BaubleApp'));

    var RootCtrl,
    scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller) {
        scope = {};
        RootCtrl = $controller('RootCtrl', {
            $scope: scope
        });
    }));

    // it('should attach a list of awesomeThings to the scope', function () {
    //   expect(scope.awesomeThings.length).toBe(3);
    // });
});
