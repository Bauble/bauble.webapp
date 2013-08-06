'use strict';

angular.module('BaubleApp')
    .directive('bsDatepicker', function () {
        return {
            template: '<input type="text" class="form-control" class="datepicker">',
            //restrict: 'E',
            restrict: 'A',
            scope: {
                model: '=ngModel',
                options: '='
            },
            replace: true,
            link: function postLink(scope, element, attrs) {
                //element.text('this is the bsDatepicker directive');
                console.log("scope: ", scope);
                console.log("scope.model: ", scope.model);
                scope.$watch(scope.model, function() {
                    console.log("scope.model: ", scope.model);
                    element.datepicker('setDate', scope.model);
                });

                var defaultOptions = {
                    autoclose: true
                };

                element.datepicker(angular.extend(defaultOptions, scope.options)).
                    on('changeDate', function(event) {
                        console.log('changedDate: ' + event.date);
                        // *** This only works if I set the date twice like this???
                        scope.model = event.date;
                        //scope.$digest();
                        scope.$apply('scope.model = event.date;');
                    });
            }
        };
    });
