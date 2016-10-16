(function(){
    angular.module('app').directive('slider', slider);

    function slider(){
        function link(scope, element){
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

        return {
            restrict: 'E',
            template: '<input type="number">',
            scope: {
                max: '@',
                min: '@',
                step: '@',
                model: '='
            },
            link: link
        }
    }
})();