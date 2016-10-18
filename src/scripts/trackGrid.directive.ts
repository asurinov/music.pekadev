module App {
    interface IVkTrackInfo {
        id: number;
        artist: string;
        title: string;
        url: string;
        playing: boolean;
    }

    interface IRecord {
        id: number;
        index: number;
        duration: number;
        progress?: string | number;
        author: string;
        title: string;
        playing: boolean;
        data: IVkTrackInfo;
    }

    interface ITrackGridControllerScope extends ng.IScope {
        seekRecord(newVal): void;
        tracks: IVkTrackInfo[];
        record: IRecord;
        volume: number;
        repeatMode: boolean;
    }

    class TrackGridController {
        static $inject = ['$scope', 'audioService'];

        constructor(
            private $scope: ITrackGridControllerScope,
            private audioService: IAudioService
        ){
            $scope.volume = audioService.getVolume();
            $scope.repeatMode = audioService.getRepeatMode();

            $scope.record = {
                id: null,
                index: 0,
                duration: 0,
                progress: 0,
                author: null,
                title: null,
                playing: false,
                data: null
            };

            $scope.seekRecord = (newVal) => {
                audioService.seekRecord(newVal);
            };

            $scope.$watch('volume', (newVal: string) => {
                audioService.setVolume(parseFloat(newVal));
            });
        }

        toggleRepeatMode(){
            this.$scope.repeatMode = !this.$scope.repeatMode;
            this.audioService.setRepeatMode(this.$scope.repeatMode);
        }

        loadRecord(index){
            var trackIndex = index % this.$scope.tracks.length;

            var record = this.$scope.tracks[trackIndex];
            if(record) {
                var player = this.audioService.getPlayer();

                if(player){
                    player.stop();
                    player.unload();
                    this.$scope.record.playing = false;
                }

                player = this.audioService.loadRecords([record.url]);

                player.on('load', () => {
                    player.play();
                    this.$scope.record = {
                        duration: Math.round(player.duration()),
                        id: record.id,
                        author: record.artist,
                        title: record.title,
                        playing: true,
                        data: record,
                        index: trackIndex
                    };
                    record.playing = true;
                });

                player.on('play', () => {
                    // Start upating the progress of the track.
                    requestAnimationFrame(() => { this.updateProgress()});
                });

                player.on('end', () => {
                    if(this.$scope.repeatMode){
                        player.play();
                    } else {
                        this.loadRecord(++trackIndex);
                    }
                });
            }
        }

        play(record, index){
            if(this.$scope.record.id !== record.id){
                this.loadRecord(index);
            }else {
                this.audioService.play();
            }

            this.$scope.record.playing = true;
            record.playing = true;
        }

        pause(){
            this.audioService.pause();
            this.$scope.record.playing = false;
            this.$scope.record.data.playing = false;
        }

        toggle(){
            if(this.canPlay()){
                if(this.$scope.record.playing){
                    this.pause();
                } else {
                    this.play(this.$scope.record.data || this.$scope.tracks[this.$scope.record.index], this.$scope.record.index);
                }
            }
        }

        canPlay(){
            return this.$scope.tracks && this.$scope.tracks.length > 0;
        }

        nextTrack(){
            this.$scope.record.index = ++this.$scope.record.index % this.$scope.tracks.length;
            this.loadRecord(this.$scope.record.index);
        }

        previousTrack(){
            var currentIndex = this.$scope.record.index;
            this.$scope.record.index = --currentIndex < 0 ? this.$scope.tracks.length + currentIndex : currentIndex;
            this.loadRecord(this.$scope.record.index);
        }

        updateProgress(){
            var player = this.audioService.getPlayer();

            this.$scope.$apply(() => {
                this.$scope.record.progress = ((player.seek() || 0) / this.$scope.record.duration).toFixed(3);
            });
            // If the sound is still playing, continue stepping.
            if (player.playing()) {
                requestAnimationFrame(() => { this.updateProgress()});
            }
        }

        searchByArtist(artist){
            this.$scope.$emit('searchByArtist', artist);
        }
    }

    angular.module('app').directive('trackGrid', () => {
        return {
            restrict: 'E',
            templateUrl: '/partials/trackGrid.view.html',
            scope: {
                tracks: '='
            },
            controller: TrackGridController,
            controllerAs: 'tgc',
            link: (scope: ITrackGridControllerScope, element: ng.IAugmentedJQuery) => {
                var progressBar = angular.element(element[0].querySelector('.progress-control'));

                progressBar.on('click', (e: any) => {
                    scope.seekRecord((e.layerX - this.offsetLeft) * this.max / this.offsetWidth);
                });

                scope.$on('destroy', () => {
                    progressBar.off('click');
                });
            }
        }
    });
}