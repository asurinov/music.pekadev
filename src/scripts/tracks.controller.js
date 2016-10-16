/**
 * Created by Machete on 27.12.2015.
 */
(function(){
    angular
        .module('app')
        .controller('tracksController', tracksController);

    tracksController['$inject'] = ['$scope', '$rootScope', 'appService', 'stringService', '$state', '$stateParams'];

    function tracksController($scope, $rootScope, appService, stringService, $state, $stateParams){
        var vm = this;

        var itemsPerPage = 50;

        var trackType = {
            myTracks: 'mytracks',
            popular: 'popular',
            search: 'search',
            recommendationByUser: 'recommendationByUser',
            recommendationByTrack: 'recommendationByUser'
        };

        vm.paging = {
            itemsPerPage: itemsPerPage,
            totalItems: 0,
            totalPages: 0,
            currentPage: 1,
            maxSize: 10
        };

        vm.dataType = null;
        vm.byArtist = false;

        $scope.goToAudioSearch = goToAudioSearch;
        $scope.onPageChanged = onPageChanged;

        $rootScope.goToMyTracks = goToMyTracks; //todo fix scope
        $rootScope.goToPopular = goToPopular;
        $rootScope.goToRecommended = goToRecommended;

        $scope.$on('searchByArtist', function (event, data) {
            vm.pattern = data;
            vm.byArtist = true;
            goToAudioSearch(true);
        });

        $scope.$watch('currentState', function(newVal, oldVal){
            switch(newVal){
                case 'recommended':
                    vm.dataType = trackType.recommendationByUser;
                    vm.paging.currentPage = parseInt($stateParams.page, 10) || 1;
                    getRecommendationsByUser();
                    break;
                case 'popular':
                    vm.dataType = trackType.myTracks;
                    getPopularList();
                    break;
                case 'mytracks':
                    vm.dataType = trackType.popular;
                    vm.paging.currentPage = parseInt($stateParams.page, 10) || 1;
                    getAudioList();
                    break;
                case 'search':
                    vm.dataType = trackType.search;
                    vm.pattern = $stateParams.query;
                    vm.byArtist = $stateParams.artist === "true" || false;
                    vm.paging.currentPage = parseInt($stateParams.page, 10) || 1;
                    audioSearch();
                    break;
                case 'track':
                    if($stateParams.trackId){
                        getAudioById($stateParams.trackId);
                    }
                    resetPaging();
                    break;
                default:
                    break;
            }
        });

        $scope.$on('$destroy', function(){
            if($scope.player){
                $scope.player.stop();
            }
        });

        function onPageChanged(){
            switch($rootScope.currentState){
                case 'recommended':
                    goToRecommended();
                    break;
                case 'popular':
                    goToPopular();
                    break;
                case 'mytracks':
                    goToMyTracks();
                    break;
                case 'search':
                    goToAudioSearch(false);
                    break;
                case 'track':
                    if($stateParams.trackId){
                        getAudioById($stateParams.trackId);
                    }
                    resetPaging();
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

        function goToAudioSearch(newSearch){
            if(newSearch){
                resetPaging();
            }

            checkPaging(trackType.search);
            $state.go('search', { query: vm.pattern, artist: vm.byArtist, page: getCurrentPage() });
        }

        function goToPopular(){
            checkPaging(trackType.popular);
            $state.go('popular');
        }

        function goToRecommended(){
            checkPaging(trackType.recommendationByUser)
            $state.go('recommended', { page: getCurrentPage() });
        }

        function goToMyTracks(){
            checkPaging(trackType.myTracks);
            $state.go('mytracks', { page: getCurrentPage() });
        }

        function audioSearch(){
            appService.searchAudio(vm.pattern, vm.byArtist, vm.paging).then(function(res){
                recalculatePaging(vm.paging, res.count);
                vm.paging.totalItems = res.count;
                $scope.audios = res.items;
            });
        }

        function getAudioList(){
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
            appService.getPopularList(vm.paging).then(function(res){
                vm.paging.totalItems = res.length;
                vm.paging.itemsPerPage = res.length;
                vm.paging.totalPages = 1;
                vm.paging.totalPagesCaption = stringService.getWordEnding(vm.paging.totalPages, 'pages');
                vm.paging.totalItemsCaption = stringService.getWordEnding(vm.paging.totalItems, 'records');
                $scope.audios = res;
            });
        }

        function getRecommendationsByUser(){
            getRecommendationsList(appService.getUserId())
        }

        function getRecommendationsByTrack(){
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
                itemsPerPage: itemsPerPage
            };
        }

        function getCurrentPage(){
            return vm.paging.currentPage;
        }

        function checkPaging(type){
            if(vm.dataType !== type){
                vm.dataType = type;
                vm.paging.currentPage = 1;
            }
        }
    }
})(angular, moment);