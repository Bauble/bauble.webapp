'use strict';

describe('Service: Invitation', function () {

    // load the service's module
    beforeEach(module('BaubleApp'));

    // instantiate service
    var Invitation;
    beforeEach(inject(function (_Invitation_) {
        Invitation = _Invitation_;
    }));

    it('should do something', function () {
        expect(!!Invitation).toBe(true);
    });

});
