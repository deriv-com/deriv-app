import { configure } from 'mobx';
import RootStore from 'Stores';
import { setWebsocket } from 'Services/ws-methods';

configure({ enforceActions: 'observed' });

const initStore = (core_store, websocket) => {
    setWebsocket(websocket);
    return new RootStore(core_store);
};

export default initStore;
