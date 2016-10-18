import {Component} from '@angular/core';
import {ITrack} from './player.models';
import {AudioService} from './audio.service';

@Component({
    selector: 'track-grid',
    template: `
    <div class="col-xs-12 audio-grid">
        <table class="table">
            <colgroup>
                <col>
                <col width="55px">
                <col width="55px">
            </colgroup>
            <tbody>
                <tr *ngFor="let audio of tracks"
                    (click)="toggle(audio, index)"
                    [ngClass]="{'playing': record.id === audio.id && audio.playing}">
                    <td>
                        <a class="track-artist"
                              title="{{audio.artist}}"
                              (click)="searchByArtist(audio.artist)">{{audio.artist}}</a>
                        -
                        <span title="{{audio.title}}">{{audio.title}}</span>
                    </td>
                    <td>
                        <span>{{audio.duration}}</span>
                    </td>
                    <td>
                        <a href="" download="" title="Скачать">
                            <i class="fa fa-download"></i>
                        </a>
                        <a uiSref="track" [uiParams]="{ trackId: audio.owner_id + '_' + audio.id }" title="Ссылка на трек">
                            <i class="fa fa-share"></i>
                        </a>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="audio-controls col-xs-12">
        <div class="row">
            <div class="col-xs-12">
                <progress id="progress-control" class="progress-control" min="0" max="1" [value]="record.progress"></progress>
            </div>
            <div class="col-xs-12">
                <div class="playback-buttons">
                    <button class="btn btn-sm btn-default" (click)="previousTrack()" [disabled]="!tracks || tracks.length === 0">
                        <span class="fa fa-step-backward"></span>
                    </button>
                    <button class="btn btn-sm btn-default" (click)="toggle()" [disabled]="!tracks || tracks.length === 0">
                        <span class="fa" [ngClass]="{'fa-play': !record.playing, 'fa-pause': record.playing}"></span>
                    </button>
                    <button class="btn btn-sm btn-default" (click)="nextTrack()" [disabled]="!tracks || tracks.length === 0">
                        <span class="fa fa-step-forward"></span>
                    </button>
                    <button class="btn btn-sm btn-default" [ngClass]="{'active': repeatMode}" (click)="repeatMode = !repeatMode">
                        <span class="fa fa-repeat"></span>
                    </button>
                </div>
                <div class="track-info">
                    <div class="marquee" *ngIf="record.data">
                        <span>{{record.author}}</span>
                        <span>&#8212;</span>
                        <span>{{record.title}}</span>
                    </div>
                </div>
                <div class="col-lg-2 col-md-2 col-sm-3 hidden-xs">
                    <label for="volume-control">Громкость</label>
                    <input id="volume-control" type="range" min="0" max="1" step="0.01" [(ngModel)]="volume"/>
                </div>
            </div>
        </div>
    </div>`,
    inputs: ['tracks']
})

export class TrackGridComponent {
    tracks: ITrack[];

    repeatMode: boolean;

    record;
    volume: number;

    constructor(private audioService: AudioService){
        this.volume = audioService.getVolume();
        this.repeatMode = audioService.getRepeatMode();

        this.record = {
            id: null,
            index: 0,
            duration: 0,
            progress: 0,
            author: null,
            title: null,
            playing: false,
            data: null
        };
    }

    toggle(audio: ITrack, index: number){
        if(this.record.playing && this.record.id === audio.id){
            this.pause();
        } else {
            this.play(audio, index);
        }
    }

    play(record, index){
        if(this.record.id !== record.id){
            this.loadRecord(index);
        }else {
            this.audioService.play();
        }

        this.record.playing = true;
        record.playing = true;
    }

    pause(){
        this.audioService.pause();
        this.record.playing = false;
        this.record.data.playing = false;
    }

    loadRecord(index){
        var trackIndex = index % this.tracks.length;

        var record = this.tracks[trackIndex];
        if(record) {
            var player = this.audioService.getPlayer();

            if(player){
                player.stop();
                player.unload();
                this.record.playing = false;
            }

            player = this.audioService.loadRecords([record.url]);

            player.on('load', () => {
                player.play();
                this.record = {
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
                if(this.repeatMode){
                    player.play();
                } else {
                    this.loadRecord(++trackIndex);
                }
            });
        }
    }

    nextTrack(){
        this.record.index = ++this.record.index % this.tracks.length;
        this.loadRecord(this.record.index);
    }

    previousTrack(){
        var currentIndex = this.record.index;
        this.record.index = --currentIndex < 0 ? this.tracks.length + currentIndex : currentIndex;
        this.loadRecord(this.record.index);
    }

    updateProgress(){
        var player = this.audioService.getPlayer();

        this.record.progress = ((player.seek() || 0) / this.record.duration).toFixed(2);

        // If the sound is still playing, continue stepping.
        if (player.playing()) {
            requestAnimationFrame(() => { this.updateProgress()});
        }
    }

    searchByArtist(artist){
        //this.$emit('searchByArtist', artist);
    }

    toggleRepeatMode(){
        this.repeatMode = !this.repeatMode;
        this.audioService.setRepeatMode(this.repeatMode);
    }
}
