
describe('Family controllers', function() {

    var scope, ctrl, $httpBackend;

    beforeEach(function() {
        this.addMatchers({
            toEqualData: function(expected) {
                return angular.equals(this.actual, expected);
             }
           });
    });

    beforeEach(module("BaubleApp.services"));


    describe('FamilyCtrl', function() {

        var scope, ctrl, $httpBackend,
            testFamily = {family: 'TestFamily', id: 1};


        beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET('/family/1')
                .respond(testFamily);

            scope = $rootScope.$new();
            ctrl = $controller(FamilyCtrl, {$scope: scope});
        }));


        it('should retrieve a family', function() {
            scope.family = scope.Family.get({familyId: '1'});
            $httpBackend.flush();

            expect(scope.family).toEqualData(testFamily);
        });

    });
});
