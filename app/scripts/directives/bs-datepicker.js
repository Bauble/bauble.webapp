'use strict';

angular.module('BaubleApp')
    .directive('bsDatepicker', function () {
        return {
            template: '<input type="text" class="form-control" class="datepicker">',
            restrict: 'E',
            scope: {
                model: '=ngModel',
                options: '='
            },
            replace: true,
            link: function postLink(scope, element, attrs) {
                //element.text('this is the bsDatepicker directive');
                console.log("scope: ", scope);
                console.log("scope.model: ", scope.model);
                attrs.value = scope.model;
                scope.$watch(scope.model, function() {
                    //attrs.value = scope.model;
                    console.log("scope.model: ", scope.model);
                });

                var defaultOptions = {
                    autoclose: true
                }
                element.datepicker(angular.extend(defaultOptions, scope.options)).
                    on('changeDate', function(event) {
                        console.log('changedDate');
                        scope.model = event.date.toString();
                    });
            }
        };
    });
