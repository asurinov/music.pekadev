/**
 * Created by Machete on 20.12.2015.
 */
(function(){
    angular.module('app').directive('customValidate', customValidateDirective);

    customValidateDirective.$inject = [];

    function customValidateDirective(){
        function customValidateDirectiveLink(scope, element, attrs, ngModel){
            scope.$watch(function(){ return ngModel.$modelValue; }, onModelChanged);

            function onModelChanged(newValue, oldValue){
                var x = 1;

                scope.viewValue = ngModel.$viewValue;
            }
        }

        return {
            restrict: 'A',
            require: 'ngModel',
            link: customValidateDirectiveLink
        }
    }
})();