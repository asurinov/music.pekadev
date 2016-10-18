import {Component} from '@angular/core';
import {ITrack} from './player.models';
import {AudioService} from './audio.service';

@Component({
    selector: 'track-grid',
    template: `
<div>
    <div class="audio-controls">
        <div class="row">
            <div class="col-lg-2 col-md-3 col-sm-3 col-xs-6 playback-buttons">
                <button class="btn btn-sm btn-primary" (click)="previousTrack()" [disabled]="!tracks || tracks.length === 0">
                    <span class="fa fa-step-backward"></span>
                </button>
                <button class="btn btn-sm btn-primary" (click)="toggle()" [disabled]="!tracks || tracks.length === 0">
                    <span class="fa" [ngClass]="{'fa-play': !record.playing, 'fa-pause': record.playing}"></span>
                </button>
                <button class="btn btn-sm btn-primary" (click)="nextTrack()" [disabled]="!tracks || tracks.length === 0">
                    <span class="fa fa-step-forward"></span>
                </button>
                <button class="btn btn-sm btn-primary" [ngClass]="{'active': repeatMode}" (click)="toggleRepeatMode()">
                    <span class="fa fa-repeat"></span>
                </button>
            </div>
            <div class="col-lg-4 col-md-4 col-sm-3 hidden-xs track-info">
                <div class="marquee" *ngIf="record.data">
                    <span>{{record.author}}</span>
                    <span>&#8212;</span>
                    <span>{{record.title}}</span>
                </div>
            </div>
            <div class="col-lg-4 col-md-3 col-sm-3 col-xs-6">
                <label for="progress-control">Прогресс</label>
                <progress id="progress-control" class="progress-control" min="0" max="1" [value]="record.progress"></progress>
            </div>
            <div class="col-lg-2 col-md-2 col-sm-3 hidden-xs">
                <label for="volume-control">Громкость</label>
                <input id="volume-control" type="range" min="0" max="1" step="0.01" [(ngModel)]="volume"/>
            </div>
        </div>
    </div>
    <div class="audio-grid">
        <div class="row audio-grid-header">
            <div class="col-md-1 col-sm-1 col-xs-1"></div>
            <div class="col-md-9 col-sm-7 col-xs-7 text-left">Название</div>
            <div class="col-md-1 col-sm-2 col-xs-2 text-center"><i class="fa fa-clock-o"></i></div>
            <div class="col-md-1 col-sm-2 col-xs-2 text-center"><i class="fa fa-gear"></i></div>
        </div>
        <div class="row audio-grid-track" *ngFor="let audio of tracks" [ngClass]="{'playing': record.id === audio.id && audio.playing}">
            <div class="col-md-1 col-sm-1 col-xs-1 text-center">
                <span class="fa" [ngClass]="{'fa-play': (!audio.playing && record.id === audio.id || record.id !== audio.id), 'fa-pause': record.id === audio.id && audio.playing }" (click)="toggle(audio, index)"></span>
            </div>
            <div class="col-md-9 col-sm-7 col-xs-7 text-left">
                <span class="track-artist" title="{{audio.artist}}" (click)="searchByArtist(audio.artist)">{{audio.artist}}</span>
                &nbsp;-&nbsp;
                <span title="{{audio.title}}">{{audio.title}}</span>
            </div>
            <div class="col-md-1 col-xs-2 col-xs-2 text-center">
                <span>{{audio.duration}}</span>
            </div>
            <div class="col-md-1 col-sm-2 col-xs-2 text-center">
                <a href="" download="" title="Скачать"><i class="fa fa-download"></i>{{audio.url}}</a>
                <a ui-sref="track({ trackId: audio.owner_id + '_' + audio.id })" title="Ссылка на трек"><i class="fa fa-share"></i></a>
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
        if(this.record.playing){
            this.pause();
        } else {
            this.play(this.record.data || this.tracks[this.record.index], this.record.index);
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
