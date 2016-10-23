export interface IPaging {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    maxSize: number;
    itemsPerPage: number;
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
