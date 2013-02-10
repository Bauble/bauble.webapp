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
            replace: true,
            scope: {
                resource: '='
            },
            template: '<div class="btn-group schema-menu">' +
                        '<a class="btn dropdown-toggle" ng-class="{disabled: !resource}" data-toggle="dropdown">' +
                          'Field' +
                          '<span class="caret"></span>' +
                        '</a>' +
                        '<ul class="dropdown-menu" role="menu" aria-labelledby="dLabel">' +
                        '</ul>' +
                       '</div>',
            link: function(scope, element, attrs, controller) {
                var baseMenu = '' +
                        '<!-- columns -->' +
                        '<li ng-repeat="column in domainSchema.columns" ng-click="onItemClicked(this, $event, column)">' +
                          '<a tabindex="-1">{{column}}</a>' +
                        '</li>' +

                        '<!-- relations -->' +
                        '<li ng-repeat="relation in domainSchema.relations" class="dropdown-submenu">' +
                          '<a ng-mouseover="mouseOver($event, this, relation)">{{relation}}</a>' +
                          '<ul class="dropdown-menu relation-submenu">' +
                          //   '<!-- this is where the submenus list items are added -->' +
                          '</ul>' +
                        '</li>';

                scope.onItemClicked = function(itemScope, event, column) {
                    // set the text on the btn to the selected item
                    var resourceParts = itemScope.resource.split("/");
                    resourceParts.push(itemScope.column);
                    resourceParts = resourceParts.splice(2); // remove the empty string and table
                    var selected = resourceParts.join('.');
                    $(element).children('.btn').first().text(selected);
                    $(element).attr("data-selected", selected);
                };

                // create a menu and append it to parentElement
                function buildMenu(resource, callback) {
                    // get the schema for a resource
                    $resource(resource).get_schema(function(response) {

                        // create a new scope for the new menu
                        var newScope = scope.$new();
                        newScope.domainSchema = response.data;
                        newScope.resource = resource;

                        // compile the menu snippet and set the new scope
                        var newMenu = $compile(baseMenu)(newScope);

                        callback(newMenu);
                    });
                }

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
                            relationUrl = scope.resource;
                        while(parentMenu.length !== 0) {
                            relationUrl += "/" + parentMenu.children('a').text();
                            parentMenu = parentMenu.parent('.dropdown-submenu');
                        }

                        //get the resource for the relation
                        buildMenu(relationUrl, function(menu) {
                            submenu.children('.dropdown-menu').first().append(menu);
                        });
                    }
                };

                scope.$watch('resource', function() {
                    // build the menu for this resource
                    if(typeof scope.resource != 'undefined') {
                        buildMenu(scope.resource, function(menu) {
                            $(element).children('.dropdown-menu').first().append(menu);
                        });
                    }
                });
            }
        };
    }]);