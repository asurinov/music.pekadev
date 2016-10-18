interface IVKAuth {
    login: (callback: (response: ILoginResponse) => void, settings: number) => void;
    logout: (callback: (response) => void) => void;
    revokeGrants: (callback: () => void) => void;
    getLoginStatus: (callback: (status: ILoginResponse) => void) => void;
    getSession: () => void
}
interface IVKApi {
    call: (apiMethodName: string, paramsObject: Object, successCallBack: (data: { response: Array<any> }) => void) => void;
}
interface IVKObserver {
    subscribe: (event: string, handler: () => void) => void;
    unsubscribe: (event: string, handler: () => void) => void;
}
interface IVKUI {

}
interface IVK {
    init: (params: { apiId: number }) => void;
    Auth: IVKAuth;
    Api: IVKApi;
    Observer: IVKObserver;
    UI: IVKUI
}

interface ILoginResponse {
    session: any;
    settings: any;
}


declare var VK: IVK;