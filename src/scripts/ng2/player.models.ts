export interface IGridModel {
    paging: Paging;
    tracks: ITrack[];
}

export class Paging {
    itemsPerPage = 50;
    totalItems: number;
    currentPage: number;

    constructor(page: number){
        this.currentPage = page;
        this.totalItems = 0;
    }

    get totalPages(){
        return Math.ceil(this.totalItems / this.itemsPerPage);
    }

    setItemsPerPage(newVal: number){
        this.itemsPerPage = newVal;
    }

    setTotalItems(newVal: number){
        this.totalItems = newVal;
    }
}

export interface ITrackList {
    items: ITrack[];
    count: number;
}

export interface ITrack {
    artist: string;
    date: number;
    duration: number;
    genre_id: number;
    id: number;
    lyrics_id: number;
    owner_id: number;
    title: string;
    url: string;
    playing?: boolean;
}
