/**
 * Created by Machete on 27.12.2015.
 */
(function(){
    angular
        .module('app')
        .controller('tracksController', tracksController);

    tracksController['$inject'] = ['$scope', 'appService', 'stringService', '$stateParams'];

    function tracksController($scope, appService, stringService, $stateParams){

        var vm = this;

        var trackType = {
            my: 'mytracks',
            popular: 'popular',
            search: 'search',
            recommendationByUser: 'recommendationByUser',
            recommendationByTrack: 'recommendationByUser'
        };

        vm.paging = null;
        vm.dataType = null;

        init();

        function init(){
            if($stateParams.trackId){
                getAudioById($stateParams.trackId);
            }
            resetPaging();
        }

        vm.loadGrid = loadGrid;
        vm.copyLink = copyLink;

        $scope.getFriendsList = getFriendsList;
        $scope.getAudioList = getAudioList;
        $scope.getPopularList = getPopularList;
        $scope.audioSearch = audioSearch;
        $scope.getRecommendationsByUser = getRecommendationsByUser;

        $scope.$on('$destroy', function(){
            if($scope.audioPlayer){
                $scope.audioPlayer.stop();
            }
        });

        function loadGrid(){
            switch(vm.dataType){
                case trackType.popular:
                    getPopularList();
                    break;
                case trackType.search:
                    audioSearch();
                    break;
                case trackType.my:
                    getAudioList();
                    break;
                case trackType.recommendationByUser:
                    getRecommendationsByUser();
                    break;
                case trackType.recommendationByTrack:
                    getRecommendationsByTrack();
                    break;
                default:
                    break;
            }
        }

        function getFriendsList(){
            appService.getFriendsList().then(function(res){
                $scope.friends = res;
            });
        }

        function audioSearch(){
            checkPaging(trackType.search);

            appService.searchAudio(vm.pattern, vm.paging).then(function(res){
                recalculatePaging(vm.paging, res.count);
                vm.paging.totalItems = res.count;
                $scope.audios = res.items;
            });
        }

        function getAudioList(){
            checkPaging(trackType.my)

            appService.getAudioList(vm.paging).then(function(res){
                recalculatePaging(vm.paging, res.count);
                $scope.audios = res.items;
            });
        }

        function getAudioById(trackId){
            appService.getAudioById(trackId).then(function(res){
                recalculatePaging(vm.paging, res.length);
                $scope.audios = res;
            });
        }

        function getPopularList(){
            checkPaging(trackType.popular);

            appService.getPopularList().then(function(res){
                vm.paging.totalItems = res.length;
                vm.paging.itemsPerPage = res.length;
                vm.paging.totalPages = 1;
                vm.paging.totalPagesCaption = stringService.getWordEnding(vm.paging.totalPages, 'pages');
                vm.paging.totalItemsCaption = stringService.getWordEnding(vm.paging.totalItems, 'records');
                $scope.audios = res;
            });
        }

        function getRecommendationsByUser(){
            checkPaging(trackType.recommendationByUser);
            getRecommendationsList(appService.getUserId())
        }

        function getRecommendationsByTrack(){
            checkPaging(trackType.recommendationByTrack);
            getRecommendationsList();
        }

        function getRecommendationsList(params){
            return appService.getRecommendations(params, vm.paging).then(function(res){
                recalculatePaging(vm.paging, res.count);
                $scope.audios = res.items;
            });
        }

        function recalculatePaging(paging, count){
            paging.totalItems = count;
            paging.totalPages = Math.ceil(count / paging.itemsPerPage);
            paging.totalPagesCaption = stringService.getWordEnding(paging.totalPages, 'pages');
            paging.totalItemsCaption = stringService.getWordEnding(paging.totalItems, 'records');
        }

        function resetPaging(){
            vm.paging = {
                totalItems: 0,
                totalPages: 0,
                currentPage: 1,
                maxSize: 10,
                itemsPerPage: 30
            };
        }

        function copyLink(record){
            var link = appService.getTrackLink(record);
            //window.clipboardData.setData('text/uri-list', link);
        }

        function checkPaging(audioType){
            if (vm.dataType !== audioType) {
                vm.dataType = audioType;
                resetPaging();
            }
        }
    }
})(angular, moment);