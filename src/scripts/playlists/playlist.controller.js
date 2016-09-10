/**
 * Created by Machete on 13.12.2015.
 */
(function(){
    angular.module('app').controller('playlistController', playlistController);

    playlistController.$inject = ['$scope', '$state', '$q', 'appService', '$uibModal'];

    function playlistController($scope, $state, $q, appService, $modal){

        init();

        function init(){
            switch($state.current.name){
                case 'playlists.element':
                    getAlbumTracks($state.params.listId);
                    break;
                case 'playlists.new':
                    createAlbum().finally(function(){
                        $state.go('playlists');
                    });
                    break;
                default:
                    getAlbums();
                    break;
            }
        }

        function createAlbum(){
            return $modal.open({
                templateUrl: '/partials/playlists/create-album.modal.view.html',
                controller: 'CreateAlbumCtrl',
                controllerAs: 'ac'
            }).result.then(function(data){
                return appService.createAlbum(data).then(function(res){
                    $scope.albums.push({id: res.album_id, title: data});
                });
            });
        }

        function getAlbums(){
            return appService.getAlbums().then(function(res){
                $scope.albums = res.items;
            });
        }

        function getAlbumTracks(albumId){
            return appService.getAlbumTracks(albumId).then(function(res){
                $scope.audios = res.items;
            });
        }
    }
})();
