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
            restrict: 'A',
            scope: {
                resource: '='
            },
            template: '<div class="btn-group schema-menu">' +
                        '<a class="btn dropdown-toggle" data-toggle="dropdown">' +
                          'Field' +
                          '<span class="caret"></span>' +
                        '</a>' +
                        '<ul class="dropdown-menu" role="menu" aria-labelledby="dLabel">' +
                        '</ul>' +
                       '</div>',
            link: function(scope, element, attrs, controller) {
                var baseMenu = '' +
                        '<!-- columns -->' +
                        '<li ng-repeat="column in domainSchema.columns" ng-click="onFieldClicked($event, column)">' +
                          '<a tabindex="-1">{{column}}</a>' +
                        '</li>' +

                        '<!-- relations -->' +
                        '<li ng-mouseover="mouseOver($event, this, relation)" ng-repeat="relation in domainSchema.relations" class="dropdown-submenu">' +
                          '<a>{{relation}}</a>' +
                          '<ul class="dropdown-menu relation-submenu">' +
                          //   '<!-- this is where the submenus list items are added -->' +
                          '</ul>' +
                        '</li>';

                // create a menu and append it to parentElement
                function buildMenu(resource, callback) {

                    console.log('buildMenu(' + resource + ')');

                    // get the schema for a resource
                    $resource(resource).get_schema(function(response) {

                        console.log('schema: ', response.data);

                        // create a new scope for the new menu
                        var newScope = scope.$new();
                        newScope.domainSchema = response.data;
                        newScope.resource = resource;

                        // compile the menu snippet and set the new scope
                        var newMenu = $compile(baseMenu)(newScope);

                        callback(newMenu);
                    });

                    scope.mouseOver = function(event, scope, relation) {
                        // if no menu has been added to this one then fetch the schema
                        // and build the sub menu
                        var submenu = $(event.target).parent('.dropdown-submenu').first();
                        if(submenu.children('.dropdown-menu').first().children().length === 0) {
                            // TODO: first add a "loading spinner" and remove it
                            // when buildMenu completes

                            // walk up the menus getting the full relation string
                            // for this menu item
                            var parentMenu = submenu,
                                schemaUrl = scope.resource;
                            while(parentMenu.length !== 0) {
                                schemaUrl += "/" + parentMenu.children('a').text();
                                parentMenu = parentMenu.parent('.dropdown-submenu');
                            }
                            schemaUrl += "/schema";
                            console.log('schemaUrl: ', schemaUrl);

                            // TODO: set up /schema service for the relations

                            //get the resource for the relation
                            //buildMenu(schemaUrl, function(menu) {
                            buildMenu(scope.resource, function(menu) {
                                submenu.children('.dropdown-menu').first().append(menu);
                            });
                        }

                    };
                }

                // ** TODO: how do we get a reference to this element
                // build the first top level menu
                if(scope.resource) {
                    buildMenu(scope.resource, function(menu) {
                        $('.schema-menu-container').append(menu);
                    });
                }

                scope.$watch('resource', function() {
                    if(typeof scope.resource != 'undefined') {
                        buildMenu(scope.resource, function(menu) {
                            // TODO: remove all .scheme-menu and append menu
                            $('.schema-menu').children('.dropdown-menu').first().append(menu);
                        });
                    }
                });
            }
        };
    }]);