(function(){
    angular.module('app').filter('pekaDuration', function() {
        return function(input, optional1, optional2) {
            var output = '';

            var seconds, minutes, hours, days;

            var minutes = Math.floor(input / 60);
            var seconds = Math.floor(input % 60);
            if(minutes > 59){
                hours = Math.floor(minutes / 60);
                minutes = Math.floor(minutes % 60);
            }

            if(hours){
                output += hours + ':';
            }

            if(minutes < 10){
                output += '0';
            }
            output += minutes;
            output += ':';

            if(seconds < 10){
                output += '0';
            }
            output += seconds;

            return output;

        };
    });
})();
