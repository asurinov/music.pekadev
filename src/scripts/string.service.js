/**
 * Created by Machete on 29.12.2015.
 */
(function(){
    angular.module('app').service('stringService', stringService);

    stringService.$inject = ['stringDictionaries'];

    function stringService(stringDictionaries){
        var vm = this;

        vm.getWordEnding = getWordEnding;

        function getWordEnding(num, dictionaryCode){
            var dictionary = stringDictionaries[dictionaryCode];
            if(dictionary){
                var rem = num % 10;
                var rem100 = num % 100;
                if(rem === 1 && rem100 !== 11){
                    return num + ' '+ dictionary[0];
                } else if(rem >= 2 && rem <= 4 && rem100 !== 12){
                    return num + ' ' + dictionary[1];
                } else {
                    return num + ' ' + dictionary[2];
                }
            } else {
                throw new Error('Cannot find dictionary "' + dictionaryCode + '"');
            }
        }
    }
})();