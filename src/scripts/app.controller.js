/**
 * Created by Machete on 01.11.2015.
 */
(function(){
    angular
        .module('app')
        .controller('appController', appController);

    appController['$inject'] = ['$scope', '$location', 'appService', 'ngAudio'];

    function appController($scope, $location, appService, ngAudio){
        var vm = this;
        vm.currentRecord = {};

        checkAuth();

        $scope.audioPlayer = null;

        $scope.getFriendsList = getFriendsList;
        $scope.getAudioList = getAudioList;
        $scope.audioSearch = audioSearch;
        $scope.login = login;
        $scope.togglePlayback = togglePlayback;

        function getUserInfo(){
            appService.getUserInfo().then(function(res){
                $scope.userInfo = res;
            });
        }

        function isAuthorized(){
            var token = appService.getAccessToken();
            return $scope.isAuthorized = token !== null;
        }

        function togglePlayback(record){
            if(record.playing){
                $scope.audioPlayer.pause();
                record.playing = false;
            } else {
                if(record.url !== vm.currentRecord.url){
                    vm.currentRecord.playing = false;
                    vm.currentRecord = record;
                    if($scope.audioPlayer){
                        $scope.audioPlayer.pause();
                    }
                }
                if(!$scope.audioPlayer || $scope.audioPlayer.id !== record.url) {
                    $scope.audioPlayer = ngAudio.load(record.url);
                }
                $scope.audioPlayer.setVolume(0.4);
                $scope.audioPlayer.play();
                record.playing = true;
            }
        }

        function login(){
            if (!isAuthorized()) {
                var path = $location.path().substr(1);
                if (path) {
                    var params = path.split('&');
                    token = getQueryVariable('access_token', params);
                }
                if (!token) {
                    window.location.href = appService.auth();
                } else {
                    var userId = getQueryVariable('user_id', params);
                    appService.setAccessParams(token, userId);
                    $location.path('/');
                    getUserInfo()
                }
            }
        }

        function getFriendsList(){
            appService.getFriendsList().then(function(res){
                $scope.friends = res;
            });
        }

        function audioSearch(){
            appService.searchAudio($scope.pattern).then(function(res){
                prepareRecords(res);
                $scope.audios = res;
            });
        }

        function getAudioList(){
            appService.getAudioList().then(function(res){
                prepareRecords(res);
                $scope.audios = res;
            });
        }

        function prepareRecords(records){
            for(var i = 0; i < records.length; i++){
                records[i].duration = Math.floor(records[i].duration / 60) + ':' + ((records[i].duration / 60 % 1) * 60).toFixed();
            }
        }

        function getQueryVariable(variable, paramArr)
        {
            for (var i=0; i < paramArr.length ; i++) {
                var pair = paramArr[i].split("=");
                if(pair[0] == variable){return pair[1];}
            }
            return(null);
        }

        function checkAuth() {
            if (!isAuthorized()) {
                var path = $location.path().substr(1);
                var token;
                if (path) {
                    var params = path.split('&');
                    token = getQueryVariable('access_token', params);
                }
                if (!token) {
                    window.location.href = appService.auth();
                } else {
                    var userId = getQueryVariable('user_id', params);
                    appService.setAccessParams(token, userId);
                    $location.path('/');
                    getUserInfo();
                }
            }
            $scope.isAuthorized = isAuthorized();
        }
    }
})();


