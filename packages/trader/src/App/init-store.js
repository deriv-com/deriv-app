import { configure }        from 'mobx';
// import Client               from '_common/base/client_base';
// import NetworkMonitor       from 'Services/network-monitor';
// import OutdatedBrowser      from 'Services/outdated-browser';
import RootStore            from 'Stores';
import { setWebsocket }     from 'Services/ws-methods';
import ServerTime           from '_common/base/server_time';
// import { setStorageEvents } from 'Utils/Events/storage';

configure({ enforceActions: 'observed' });

const initStore = (core_store, websocket) => {
    ServerTime.init(core_store.common.time_promise, core_store.common.server_time);
    setWebsocket(websocket);
    const root_store = new RootStore(core_store);

    root_store.modules.trade.init();

    return root_store;
};

export default initStore;
