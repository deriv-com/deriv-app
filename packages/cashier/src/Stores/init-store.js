import { configure } from 'mobx';
import { setWebsocket } from 'Services/ws-methods';
import RootStore from './index';

configure({ enforceActions: 'observed' });

const initStore = (core_store, websocket) => {
    setWebsocket(websocket);
    return new RootStore(core_store);
};

export default initStore;
