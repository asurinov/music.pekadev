(function(){
    angular.module('app').service('audioService', audioService);

    audioService['$inject'] = ['$http', '$q', 'urlService'];

    function audioService(){

        var vm = this;
        vm.play = play;
        vm.pause = pause;

        function play(record, index){
            if($scope.record.id !== record.id){
                loadRecord(index);
            }else {
                $scope.player.play();
            }

            $scope.record.playing = true;
            record.playing = true;
        }

        function pause(){
            $scope.player.pause();
            $scope.record.playing = false;
            $scope.record.data.playing = false;
        }
    }
})();