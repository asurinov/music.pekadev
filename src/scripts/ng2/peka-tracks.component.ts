import { Component, Input, OnInit } from '@angular/core';
import { ITrack, Paging, IGridModel } from './player.models';

@Component({
    selector: 'peka-tracks',
    template: `
    <ngb-pagination [collectionSize]="paging.totalItems" [(page)]="paging.currentPage" [pageSize]="paging.itemsPerPage" [maxSize]="5" [rotate]="true" [boundaryLinks]="true"></ngb-pagination>
    <track-grid [tracks]="tracks"></track-grid>`
})

export class PekaTracksComponent implements OnInit {
    @Input() gridModel: IGridModel;

    tracks: ITrack[];
    paging: Paging;

    constructor() {
        var x = 1;
    }

    ngOnInit(){
        this.tracks = this.gridModel.tracks;
        this.paging = this.gridModel.paging
    }

}

