'use strict';

describe('Service: apiRoot', function () {

    // load the service's module
    beforeEach(module('BaubleApp'));

    // instantiate service
    var apiRoot;
    beforeEach(inject(function (_apiRoot_) {
        apiRoot = _apiRoot_;
    }));

    it('should do something', function () {
        expect(!!apiRoot).toBe(true);
    });

});
