'use strict';

/* Directives */

angular.module('BaubleApp.directives', [])
    .directive('appVersion', ['version', function(version) {
        return function(scope, elm, attrs) {
          elm.text(version);
        };
    }])

    .directive('emit', [function() {
        return {
            restrict: 'A',
            scope: true,
            link: function(scope, elm, attrs, controller) {
                elm.bind('click', function() {
                    scope.$emit(attrs.emit);
                });
            }
        };
    }])

    .directive('schemaMenu', ['$compile', 'Bauble.$resource', function($compile, $resource) {
        return {
            restrict: 'E',
            // scope: true,
            scope: {
                resource: '='
            },
            template: '<div class="btn-group schemaMenu"></div>' +
                        '<a class="btn dropdown-toggle" data-toggle="dropdown">' +
                          'Field' +
                          '<span class="caret"></span>' +
                        '</a>' +
                       '</div>',
            link: function(scope, element, attrs, controller) {
                var baseMenu = '' +
                      '<ul class="dropdown-menu" role="menu" aria-labelledby="dLabel">' +

                        '<!-- columns -->' +
                        '<li ng-repeat="column in domainSchema.columns" ng-click="onFieldClicked($event, column)">' +
                          '<a tabindex="-1">{{column}}</a>' +
                        '</li>' +

                        '<!-- relations -->' +
                        '<li ng-mouseover="mouseOver(relation)" ng-repeat="relation in domainSchema.relations" class="dropdown-submenu">' +
                          '<a>{{relation}}</a>' +
                          '<ul class="dropdown-menu relation-submenu">' +
                            '<li><a></a></li>' + // should be a loading... or spinner or something
                          '</ul>' +
                        '</li>' +

                '</div>';


                // create a menu and append it to parentElement
                function buildMenu(resource, parentElement) {

                    // get the schema for a resource
                    $resource(resource).get_schema(function(response) {

                        // create a new scope for the new menu
                        var newScope = scope.$new();
                        newScope.domainSchema = response.data;
                        newScope.resource = resource;

                        // compile the menu snippet and set the new scope
                        var newMenu = $compile(baseMenu)(newScope);

                        // add the new menu to the parent
                        $(parentElement).append(newMenu);
                    });
                }


                // ** TODO: how do we get a reference to this element
                // build the first top level menu
                console.log('scope: ', scope);
                console.log('scope.resource: ', scope.resource);
                if(scope.resource) {
                    buildMenu(scope.resource, $('.schemaMenu'));
                }

                scope.$watch(scope.resource, function() {
                    console.log('resource changed: ', scope.resource);
                });
            }
        };
    }]);