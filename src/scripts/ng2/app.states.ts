import {PlayerComponent} from "./peka-player.component";

export const mainState = { name: 'main', url: '/', component: PlayerComponent};
export const myTracksState = { name: 'mytracks', url: '/mytracks/:page',  component: PlayerComponent };
export const popularState = { name: 'popular', url: '/popular',  component: PlayerComponent };
export const recommendedState = { name: 'recommended', url: '/recommended/:page',  component: PlayerComponent };
export const searchState = { name: 'search', url: '/search?query&artist&page',  component: PlayerComponent };

