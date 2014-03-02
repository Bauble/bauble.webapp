'use strict';

describe('Controller: FamilyEditCtrl', function () {

    // load the controller's module
    beforeEach(module('BaubleApp'));

    var FamilyEditorCtrl,
        scope,
        globals,
        apiRoot,
        $httpBackend;

    // Initialize the controller and a mock scope
    beforeEach(inject(function (_globals_, _apiRoot_, $controller, $httpBackend) {
        scope = {};
        globals = _globals_;
        apiRoot = _apiRoot_;
        $httpBackend.when('GET', apiRoot + '/family/1').respond(
            {family: "TestFamily"});
        FamilyEditorCtrl = $controller('FamilyEditCtrl', {
            $scope: scope
        });

    }));

    afterEach(function() {
        globals.setSelected({});
    });


    describe("with a selected object", function() {
        beforeEach(inject(function($controller) {
            globals.setSelected({family: "TestFamily"})
            FamilyEditorCtrl = $controller('FamilyEditCtrl', {
                $scope: scope
            });
        }));

        afterEach(function(){
            globals.setSelected({});
        });

        it('should use the selected object.', function() {
            //expect(scope.family.ref).toBe(globals.getSelected().ref)
        });
    });


    describe("with no selection", function() {
        it('should create a empty family object. ', function() {
            expect(JSON.stringify(scope.family)).toBe('{}');
        });
    });
});
