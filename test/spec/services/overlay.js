'use strict';

describe('Service: overlay', function () {

    // load the service's module
    beforeEach(module('BaubleApp'));

    // instantiate service
    var overlay;
    beforeEach(inject(function (_overlay_) {
        overlay = _overlay_;
    }));

    it('should do something', function () {
        expect(!!overlay).toBe(true);
    });

});
