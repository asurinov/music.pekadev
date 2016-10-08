declare module App {

    interface IAppService {
        createAlbum(name: string): ng.IPromise<any>;
        setAccessParams(session): void;
        auth(): ng.IPromise<any>;
        logout(): ng.IPromise<any>;
        getUserInfo(userId?: number): ng.IPromise<any>;
        getFriendsList(userId?: number): ng.IPromise<any>;
        searchAudio(pattern: string, byArtist: boolean, paging): ng.IPromise<any>;
        getAudioList(paging): ng.IPromise<any>;
        getAudioById(id): ng.IPromise<any>;
        getPopularList(paging): ng.IPromise<any>;
        getAlbums(): ng.IPromise<any>;
        getAlbumTracks(albumId): ng.IPromise<any>;
        getRecommendations(param, paging): ng.IPromise<any>;
        getLoginStatus(): ng.IPromise<any>;
        getUserId(): number;
    }

    interface IAudioService {
        play(): void;
        pause(): void;
        getVolume(): number;
        setVolume(val: number): void;
        seekRecord(val: number): void;
        loadRecords(urls: string[]): any;
        getPlayer(): any;
        getRepeatMode(): boolean;
        setRepeatMode(val: boolean): void;
    }

    interface IStringService {
        getWordEnding(num: number, dictionaryCode: string): string;
    }

    interface IUrlService {
        getHost(): string;
    }

    interface IRootScope extends ng.IRootScopeService {
        currentState: string;
    }
}