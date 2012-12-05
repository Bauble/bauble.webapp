describe('Bauble Controllers', function(){

    beforeEach(function() {

    });

    describe('SearchCtrl', function() {

        beforeEach(inject(function(_$httpbackend_,$rootScope, $controller) {
            $httpbackend = _$httpbackend_;
            //$httpbackend.expectGET('/search/')

            scope = $rootScope.$new();
            ctrl = $controller(SearchCtrl, {$scope: scope});
        }));


        it("should do something", function() {


        });
    });
});