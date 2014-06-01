'use strict';

describe('Service: ViewMeta', function () {

  // load the service's module
  beforeEach(module('BaubleApp'));

  // instantiate service
  var ViewMeta;
  beforeEach(inject(function (_ViewMeta_) {
    ViewMeta = _ViewMeta_;
  }));

  it('should do something', function () {
    expect(!!ViewMeta).toBe(true);
  });

});
