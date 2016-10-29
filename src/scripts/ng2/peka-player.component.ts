import {Component, OnInit} from '@angular/core';
import {StateService} from 'ui-router-ng2';
import {TrackTypes} from './enums';
import {Paging, ITrackList, ITrack} from './player.models';
import {AppService} from "./app.service";

@Component({
    selector: 'peka-player',
    template: `
<div class="container">
    <div class="row">
        <div class="col-md-6 col-xs-12">
            <div class="row">
                <div class="input-group">
                    <span class="input-group-btn">
                        <button type="button" class="btn btn-default" [class.active]="byArtist" (click)="byArtist = !byArtist"><i class="fa fa-users"></i></button>
                    </span>
                    <input type="text" class="form-control" placeholder="Поиск аудиозаписей" [(ngModel)]="pattern" (keyup.enter)="goToAudioSearch(true)">
                    <span class="input-group-btn">
                        <button class="btn btn-default" type="button" (click)="goToAudioSearch(true)" [disabled]="!pattern"><i class="fa fa-search"></i></button>
                    </span>
                </div>
            </div>
        </div>
    </div>
    <nav aria-label="Page navigation">
        <ul class="pagination">
            <li class="page-item" [class.disabled]="paging.currentPage === 1" (click)="previousPage()">
                <span class="page-link" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                    <span class="sr-only">Previous</span>
                </span>
            </li>
            <li><span>{{paging.currentPage}}</span></li>
            <li class="page-item" [class.disabled]="paging.currentPage === paging.totalPages" (click)="nextPage()">
                <span class="page-link" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                    <span class="sr-only">Next</span>
                </span>
            </li>
        </ul>
    </nav>
    <track-grid [tracks]="tracks" (onSearchByArtist)="searchByArtist($event)"></track-grid>
</div>`
})

export class PlayerComponent {

    byArtist: boolean;
    pattern: string;

    tracks: ITrack[] = [];
    paging: Paging;

    dataType: TrackTypes;

    constructor(
        private stateService: StateService,
        private appService: AppService
    ) {
        this.paging = new Paging(parseInt(stateService.params['page'], 10) || 1);
        this.loadTracks();
    }

    private loadTracks(){
        switch(this.stateService.$current.name){
            case 'recommended':
                this.dataType = TrackTypes.Recommended;
                this.getRecommendationsList();
                break;
            case 'mytracks':
                this.dataType = TrackTypes.MyTracks;
                this.getAudioList();
                break;
            case 'popular':
                this.dataType = TrackTypes.Popular;
                this.getPopularList();
                break;
            case 'search':
                this.dataType = TrackTypes.Search;
                this.pattern = decodeURIComponent(this.stateService.params['query']);
                this.byArtist = this.stateService.params['byArtist'] === "true" || false;
                this.audioSearch();
                break;
            case 'track':
                // if(this.stateService.params['trackId']){
                //     this.getAudioById(this.stateService.params['trackId']);
                // }
                // this.resetPaging();
                break;
            default:
                break;
        }
    }

    getPopularList(){
        this.appService.getPopularList(this.paging).then((res: any[]) => {
            this.paging.setTotalItems(res.length);
            this.tracks = res;
        });
    }

    getAudioList(){
        this.appService.getAudioList(this.paging).then((res: ITrackList) => {
            this.paging.setTotalItems(res.count);
            this.tracks = res.items;
        });
    }

    getRecommendationsList(){
        return this.appService.getRecommendations(this.paging).then((res: ITrackList) => {
            this.paging.setTotalItems(res.count);
            this.tracks = res.items;
        });
    }

    audioSearch(){
        this.appService.searchAudio(this.pattern, this.byArtist, this.paging).then((res: ITrackList) => {
            this.paging.setTotalItems(res.count);
            this.tracks = res.items;
        });
    }

    nextPage(){
        this.onPageChanged(++this.paging.currentPage);
    }

    previousPage(){
        this.onPageChanged(--this.paging.currentPage);
    }

    onPageChanged(page: number){
        switch(this.stateService.$current.name){
            case 'recommended':
            case 'mytracks':
            case 'popular':
                this.stateService.go(this.stateService.$current.name, { page: page });
                break;
            case 'search':
                this.stateService.go(this.stateService.$current.name, { page: page, pattern: this.pattern, byArtist: this.byArtist });
                break;
            default:
                break;
        }
    }

    searchByArtist(artist: string){
        this.pattern = artist;
        this.byArtist = true;
        this.goToAudioSearch(true);
    }

    goToAudioSearch(newSearch: boolean){
        if(newSearch){
            this.paging = new Paging(1);
        }

        this.stateService.go('search', { query: this.pattern, byArtist: this.byArtist, page: this.paging.currentPage });
    }
}