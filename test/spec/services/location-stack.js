'use strict';

describe('Service: LocationStack', function () {

    // load the service's module
    beforeEach(module('BaubleApp'));

    // instantiate service
    var locationStack;
    beforeEach(inject(function (_locationStack_) {
        locationStack = _locationStack_;
    }));

    it('should do something', function () {
        locationStack.push('/dashboard');
        locationStack.push('/search');
        locationStack.pop();
    });

});
