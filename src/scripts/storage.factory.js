/**
 * Created by Machete on 27.12.2015.
 */
(function(){

    angular.module('app').factory('appStorage', appStorage);

    appStorage.$inject = ['$window', '$log'];
    function appStorage($window, $log) {
        var storage = 'localStorage';
        var store = {};

        var isStorageAvailable = (function() {
            try {
                var supported = $window[storage] !== null;

                if (supported) {
                    var key = Math.random().toString(36).substring(7);
                    $window[storage].setItem(key, '');
                    $window[storage].removeItem(key);
                }

                return supported;
            } catch (e) {
                return false;
            }
        })();

        if (!isStorageAvailable) {
            $log.warn(storage + ' is not available.');
        }

        return {
            get: function(key) {
                return isStorageAvailable ? $window[storage].getItem(key) : store[key];
            },
            set: function(key, value) {
                return isStorageAvailable ? $window[storage].setItem(key, value) : store[key] = value;
            },
            remove: function(key) {
                return isStorageAvailable ? $window[storage].removeItem(key): delete store[key];
            }
        };
    }

})();