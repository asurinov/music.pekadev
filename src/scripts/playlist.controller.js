/**
 * Created by Machete on 13.12.2015.
 */
(function(){
    angular.module('app').controller('playlistController', playlistController);

    playlistController.$inject = ['$scope', '$routeParams', 'appService'];

    function playlistController($scope, $routeParams, appService){
        var vm = this;

        if($routeParams.listId){
            getAlbumTracks($routeParams.listId);
        }else {
            getAlbums();
        }

        function getAlbums(){
            appService.getAlbums().then(function(res){
                $scope.albums = res.items;
            });
        }

        function getAlbumTracks(albumId){
            appService.getAlbumTracks(albumId).then(function(res){
                $scope.audios = res.items;
            });
        }
    }
})();
