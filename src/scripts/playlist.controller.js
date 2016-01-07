/**
 * Created by Machete on 13.12.2015.
 */
(function(){
    angular.module('app').controller('playlistController', playlistController);

    playlistController.$inject = ['$scope', '$routeParams', 'appService'];

    function playlistController($scope, $routeParams, appService){
        var vm = this;
        vm.maskedValue = '2222222222';

        vm.options = {
            clearOnBlur: false
        };

        getAlbums();

        function getAlbums(){
            appService.getAlbums().then(function(res){
                $scope.albums = res.items;
            });
        }
    }
})();
