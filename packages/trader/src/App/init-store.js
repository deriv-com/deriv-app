import { configure }        from 'mobx';
import RootStore            from 'Stores';
import { setWebsocket }     from 'Services/ws-methods';
import { setClientBase }    from '_common/base/client_base';
import ServerTime           from '_common/base/server_time';

configure({ enforceActions: 'observed' });

const initStore = (core_store, websocket, client_base) => {
    ServerTime.init(core_store.common);
    setWebsocket(websocket);
    setClientBase(client_base);
    const root_store = new RootStore(core_store);

    root_store.modules.trade.init();

    return root_store;
};

export default initStore;
