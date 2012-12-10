describe('Search controllers', function() {

    var scope, ctrl, $httpBackend;

    beforeEach(function() {
        this.addMatchers({
            toEqualData: function(expected) {
                return angular.equals(this.actual, expected);
             }
           });
    });

    beforeEach(module("BaubleApp.services"));


    describe('SearchCtrl', function() {

        var scope, ctrl, $httpBackend,
            testResponse = {results: [{family: 'TestFamily', id: 1}]};


        beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET('/search?q=1')
                .respond(testResponse);

            scope = $rootScope.$new();
            ctrl = $controller(SearchCtrl, {$scope: scope});
        }));


        it('should retrieve a result', function() {
            scope.Search('1');
            $httpBackend.flush();

            console.log(scope.results);
            expect(scope.results).toEqualData(testResponse.results);
        });

    });
});
