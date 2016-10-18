module App {

    interface ISliderScope extends ng.IScope {
        min: number;
        max: number;
        step: number;
        model: number;
    }

    const Slider: Function;

    angular.module('app').directive('slider', () => {
        return {
            restrict: 'E',
            template: '<input type="number">',
            scope: {
                max: '@',
                min: '@',
                step: '@',
                model: '='
            },
            link: (scope: ISliderScope , element: ng.IAugmentedJQuery) => {
                var slider = new Slider(element[0].getElementsByTagName('input')[0], {
                    min: scope.min || 0,
                    max: scope.max || 100,
                    step: scope.step || 1
                    //orientation: 'vertical',
                    //reversed: true
                });

                slider.on('change', function(data) {
                    scope.$apply(function() {
                        scope.model = data.newValue;
                    })
                });

                scope.$watch('model', function(val) {
                    slider.setValue(val);
                });
            }
        }
    });
}