import {PlayerComponent} from "./peka-player.component";

export const myTracksState = { name: 'mytracks', url: '/mytracks/:page',  component: PlayerComponent };
export const popularState = { name: 'popular', url: '/popular',  component: PlayerComponent };
export const searchState = { name: 'search', url: '/search?query&byArtist&page',  component: PlayerComponent };
export const recommendedState = { name: 'recommended', url: '/recommended/:page', component: PlayerComponent };

