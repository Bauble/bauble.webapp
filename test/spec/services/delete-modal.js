'use strict';

describe('Service: DeleteModal', function () {

    // load the service's module
    beforeEach(module('BaubleApp'));

    // instantiate service
    var DeleteModal;
    beforeEach(inject(function (_DeleteModal_) {
        DeleteModal = _DeleteModal_;
    }));

    it('should do something', function () {
        expect(!!DeleteModal).toBe(true);
    });

});
