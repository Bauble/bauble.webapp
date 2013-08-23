'use strict';

angular.module('BaubleApp')
    .directive('schemaMenu', function ($compile, Resource) {
        return {
            restrict: 'A',
            replace: true,
            transclude: true,
            scope: {
                resource: '=',
                scalarsOnly: '@',
                onSelect: '='
                // label2: '=?' // i think this is only available in ng 1.2
            },
            template: '<div class="btn-group schema-menu">' +
                '<button type="button" class="btn btn-default dropdown-toggle" ng-class="{disabled: !resource}" data-toggle="dropdown">' +
                '{{label}}' +
                '<span class="caret"></span>' +
                '</button>'+

            '<ul class="dropdown-menu" role="menu" aria-labelledby="dLabel">' +
                '</ul>' +
                '</div>',
            link: function(scope, element, attrs) {
                var baseMenu = '' +
                        '<!-- columns -->' +
                        '<li ng-repeat="(column, value) in schema.columns" ng-click="onItemClicked(this, $event, column)">' +
                          '<a tabindex="-1">{{column}}</a>' +
                        '</li>' +

                        '<!-- relations -->' +
                        '<li ng-repeat="relation in schema.relations" class="dropdown-submenu">' +
                          '<a ng-mouseover="mouseOver($event, this, relation)">{{relation}}</a>' +
                          '<ul class="dropdown-menu relation-submenu">' +
                          //   '<!-- this is where the submenus list items are added -->' +
                          '</ul>' +
                        '</li>';

                // TODO: when we move to ng-1.2 use the =? scope value for
                // label so we can make it optional
                if(!scope.label) {
                    scope.label = 'Select a field';
                }

                scope.onItemClicked = function(itemScope, event, column) {
                    // set the text on the btn to the selected item
                    var resourceParts = itemScope.resource.split("/");
                    resourceParts.push(itemScope.column);
                    resourceParts = resourceParts.splice(2); // remove the empty string and table
                    var selected = resourceParts.join('.');
                    element.children('.btn').first().text(selected);
                    element.attr("data-selected", selected);

                    // emit the event to let any listeners know that selection has
                    // been made
                    scope.$emit('schema-column-selected', element, selected);

                    if(scope.onSelect){
                        scope.onSelect(event, column, selected);
                    }
                };

                // create a menu and append it to parentElement
                function buildMenu(resource, callback) {
                    // get the schema for a resource
                    Resource(resource).get_schema(scope.scalarsOnly)
                        .success(function(data, status, headers, config) {
                            // create a new scope for the new menu
                            var newScope = scope.$new();
                            newScope.schema = data;
                            newScope.resource = resource;

                            // compile the menu snippet and set the new scope
                            var newMenu = $compile(baseMenu)(newScope);
                            callback(newMenu);
                        })
                        .error(function(data, status, headers, config) {
                            // do something
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
                    if(typeof scope.resource !== 'undefined') {
                        buildMenu(scope.resource, function(menu) {
                            // TODO: can this be dont with one called like replaceWith()
                            // instead of first emptying and then appending
                            element.children('.dropdown-menu').first().empty()
                                .append(menu);
                        });
                    }
                });
            }
        };
  });
