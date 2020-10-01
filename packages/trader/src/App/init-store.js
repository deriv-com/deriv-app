import { configure } from 'mobx';
import RootStore from 'Stores';
import { setWebsocket } from 'Services/ws-methods';
import ServerTime from '_common/base/server_time';

configure({ enforceActions: 'observed' });

const initStore = (core_store, websocket) => {
    ServerTime.init(core_store.common);
    setWebsocket(websocket);
    const root_store = new RootStore(core_store);

    root_store.modules.trade.init();

    return root_store;
};

export default initStore;
