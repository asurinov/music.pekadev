module App {
    angular.module('app').directive('onEnter', () => {
        return (scope, elm, attrs) => {
            elm.bind("keyup", (event) => {
                if(event.which === 13) {
                    scope.$apply(() => {
                        scope.$eval(attrs.onEnter);
                    });
                    event.preventDefault();
                }
            });
        };
    });
}