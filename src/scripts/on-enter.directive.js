(function(){
    angular.module('app').directive('onEnter', function() {
        return function(scope, elm, attrs) {
            elm.bind("keyup", function(event) {
                if(event.which === 13) {
                    scope.$apply(function() {
                        scope.$eval(attrs.onEnter);
                    });
                    event.preventDefault();
                }
            });
        };
    });
})();