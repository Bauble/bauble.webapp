
describe('Family controller', function() {

    var scope, ctrl, $httpBackend;

    beforeEach(function() {
        this.addMatchers({
            toEqualData: function(expected) {
                return angular.equals(this.actual, expected);
             }
           });
    });

    beforeEach(module("BaubleApp.services"));


    describe('Family.get()', function() {

        var scope, ctrl, $httpBackend,
            testFamily = {family: 'TestFamily', id: 1};

        beforeEach(inject(function(_$httpBackend_, $rootScope, $controller, globals) {
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET(globals.apiRoot + '/family/1')
                .respond(testFamily);

            scope = $rootScope.$new();
            ctrl = $controller(FamilyCtrl, {$scope: scope});
        }));


        it('should retrieve a family', function() {
            scope.Family.get(testFamily.id, function(response) {
                scope.family = response.data;
            });
            $httpBackend.flush();

            expect(scope.family).toEqualData(testFamily);
        });
    });


    describe('Family.save()', function() {

        var scope, ctrl, $httpBackend,
            testFamily = {family: 'TestFamily', id: 1};


        beforeEach(inject(function(_$httpBackend_, $rootScope, $controller, globals) {
            $httpBackend = _$httpBackend_;
            $httpBackend.expectPOST(globals.apiRoot + '/family')
                .respond('');

            scope = $rootScope.$new();
            ctrl = $controller(FamilyCtrl, {$scope: scope});
        }));

        it('should save a family', function() {
            scope.Family.save(testFamily);
            $httpBackend.flush();
        });
    });


    describe('Family.delete()', function() {

        var scope, ctrl, $httpBackend,
            testFamily = {family: 'TestFamily', id: 1};


        beforeEach(inject(function(_$httpBackend_, $rootScope, $controller, globals) {
            $httpBackend = _$httpBackend_;
            $httpBackend.expectDELETE(globals.apiRoot + '/family/1')
                .respond('');

            scope = $rootScope.$new();
            ctrl = $controller(FamilyCtrl, {$scope: scope});
        }));

        it('should delete a family', function() {
            scope.Family.del(testFamily.id);
            $httpBackend.flush();
        });
    });


    describe('Family.delete()', function() {

        var scope, ctrl, $httpBackend,
            testFamily = {family: 'TestFamily', id: 1};


        beforeEach(inject(function(_$httpBackend_, $rootScope, $controller, globals) {
            $httpBackend = _$httpBackend_;
            $httpBackend.expectDELETE(globals.apiRoot + '/family/1')
                .respond('');

            scope = $rootScope.$new();
            ctrl = $controller(FamilyCtrl, {$scope: scope});
        }));

        it('should delete a family', function() {
            scope.Family.del(testFamily.id);
            $httpBackend.flush();
        });
    });
});
