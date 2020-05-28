import { configure } from 'mobx';
import RootStore from 'Stores';
import { setWebsocket } from 'Services/ws-methods';
import { setClientBase } from 'Duplicated/_common/base/client_base';

configure({ enforceActions: 'observed' });

const initStore = (core_store, websocket, client_base) => {
    setWebsocket(websocket);
    setClientBase(client_base);
    return new RootStore(core_store);
};

export default initStore;
