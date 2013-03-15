'use strict';

describe('Service: Resource', function () {

  // load the service's module
  beforeEach(module('BaubleApp'));

  // instantiate service
  var Resource;
  beforeEach(inject(function (_Resource_) {
    Resource = _Resource_;
  }));

  it('should do something', function () {
    expect(!!Resource).toBe(true);
  });

});
