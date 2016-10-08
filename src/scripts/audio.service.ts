module App {

    class AudioService implements IAudioService {
        static $inject = ['Howl', 'Howler'];

        repeatMode = false;
        player;

        constructor(
            private Howl,
            private Howler
        ){}

        setRepeatMode(val: boolean){
            this.repeatMode = val;
        }

        getRepeatMode(){
            return this.repeatMode;
        }

        getPlayer(){
            return this.player;
        }

        loadRecords(urls: string[]){
            this.player = new this.Howl({src: urls, html5: true});
            return this.player;
        }

        seekRecord(val: number){
            if(this.player){
                this.player.pause();
                this.player.seek(val *  this.player.duration());
                this.player.play();
            }
        }

        setVolume(val: number){
            this.Howler.volume(val);
        }

        getVolume(){
            return this.Howler.volume();
        }

        play(){
            this.player.play();
        }

        pause(){
            this.player.pause();
        }

    }

    angular.module('app').service('audioService', AudioService);
}