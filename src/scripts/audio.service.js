(function(){
    angular.module('app').service('audioService', audioService);

    audioService['$inject'] = ['$http', '$q', 'urlService'];

    function audioService(){

        var vm = this;

        vm.volume = 0.5;
        vm.repeatMode = false;

        vm.play = play;
        vm.pause = pause;

        vm.setVolume = setVolume;
        vm.getVolume = getVolume;
        vm.setRepeatMode = setRepeatMode;
        vm.getRepeatMode = getRepeatMode;
        vm.getPlayer = getPlayer;
        vm.loadRecords = loadRecords;
        vm.seekRecord = seekRecord;

        function setRepeatMode(val){
            vm.repeatMode = val;
        }

        function getRepeatMode(){
            return vm.repeatMode;
        }

        function getPlayer(){
            return vm.player;
        }

        function loadRecords(urls){
            vm.player = new Howl({src: urls, html5: true});
            return vm.player;
        }

        function seekRecord(val){
            if(vm.player){
                vm.player.pause();
                vm.player.seek(val *  vm.player.duration());
                vm.player.play();
            }
        }

        function setVolume(val){
            Howler.volume(val);
        }

        function getVolume(){
            return Howler.volume();
        }

        function play(){
            vm.player.play();
        }

        function pause(){
            vm.player.pause();
        }
    }
})();