'use strict';

angular.module('BaubleApp')
    .directive('geographyMenu', function ($http, $compile, Alert) {
        return {
            //templateUrl: 'views/geo-menu.html',
            //template: '<a class="dropdown-toggle" ng-transclude></a>',
            template: '<span class="geo-menu dropdown">' +
                '<a class="dropdown-toggle" ng-transclude></a>' +
                '</span>',
            restrict: 'EA',
            transclude: true,
            replace: true,
            scope: {
                onClick: '&',
            },
            link: function postLink(scope, element, attrs) {
                scope.data = [];
                scope.indexedData = {};

                scope.onSelected = function(id) {
                    scope.onClick({geo: scope.indexedData[id]});
                };

                scope.buildMenu = function(rows) {
                    var li, row, a;
                    var items = [];
                    for(var i=0; i<rows.length; i++) {
                        row = rows[i];
                        a = $('<a ng-click="onSelected('+row.id+')"></a>')
                            .text(row.name);
                        li = $('<li></li>').append(a);
                        if(row.children && row.children.length > 0) {
                            li.addClass('dropdown-submenu');
                            a.append('<i class="pull-right fa fa-angle-right"></i>');
                            li.append($('<ul class="dropdown-menu"></ul>')
                                      .append(scope.buildMenu(row.children)));
                        }
                        items.push(li);
                    }

                    // return an array of li elements
                    return items;
                };

                scope.$watch('data', function(data){
                    element.find('.dropdown-menu').remove();  // remove the old menus

                    if(!data || data.length === 0) {
                        return;
                    }
                    var items = scope.buildMenu(data);
                    var ul = $('<ul class="dropdown-menu"></ul').append(items);
                    var compiled = $compile(ul)(scope);
                    element.find('.dropdown-toggle').after(compiled);
                });


                function flatten(items) {
                    var item;
                    for(var i=items.length-1; i>=0; i--) {
                        item = items[i];
                        if(item.children && item.children.length > 0) {
                            items = items.concat(flatten(item.children));
                        }
                    }
                    return items;
                }

                $http.get('/data/geography.js')
                    .success(function(data, status, headers, config) {
                        scope.data = data;
                        var flat = flatten(data);
                        scope.indexedData = _.indexBy(flat, 'id');
                    })
                    .error(function(data, status, headers, config) {
                        var defaultMessage = 'Could not get data for distribution menu.';
                        Alert.onErrorResponse(data, defaultMessage);
                    });
            }
        };
    });
