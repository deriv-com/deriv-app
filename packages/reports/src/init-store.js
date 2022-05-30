import { configure } from 'mobx';
import RootStore from 'Stores';
import { setWebsocket, ServerTime } from '@deriv/shared';

configure({ enforceActions: 'observed' });

let root_store;

const initStore = (core_store, websocket) => {
    if (root_store) return root_store;

    ServerTime.init(core_store.common);
    setWebsocket(websocket);
    root_store = new RootStore(core_store);

    return root_store;
};

export default initStore;
