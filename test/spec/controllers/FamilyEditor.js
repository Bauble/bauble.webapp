'use strict';

describe('Controller: FamilyEditorCtrl', function () {

    // load the controller's module
    beforeEach(module('BaubleApp'));

    var FamilyEditorCtrl,
        scope,
        globals,
        $httpBackend;

    // Initialize the controller and a mock scope
    beforeEach(inject(function (_globals_, $controller, $httpBackend) {
        scope = {};
        globals = _globals_;
        globals.apiRoot = "/test"
        $httpBackend.when('GET', '/test/family/1').respond(
            {ref: "/family1", family: "TestFamily"});
        FamilyEditorCtrl = $controller('FamilyEditorCtrl', {
            $scope: scope
        });

    }));

    afterEach(function() {
        globals.setSelected({});
    });


    describe("with a selected object", function() {
        beforeEach(inject(function($controller) {
            globals.setSelected({ref: "/family/1", family: "TestFamily"})
            FamilyEditorCtrl = $controller('FamilyEditorCtrl', {
                $scope: scope
            });
        }));

        afterEach(function(){
            globals.setSelected({});
        })

        it('should use the selected object.', function() {
            expect(scope.family.ref).toBe(globals.getSelected().ref)
        });
    });


    describe("with no selection", function() {
        it('should create a empty family object. ', function() {
            expect(JSON.stringify(scope.family)).toBe('{}');
        });
    });
});
