import { configure } from 'mobx';
import { setWebsocket } from '@deriv/shared';
import ServerTime from '_common/base/server_time';
import { TCoreStores } from '@deriv/stores/types';
import type { TWebSocket } from 'Types';
import RootStore from '../Stores';

configure({ enforceActions: 'observed' });

let root_store: TCoreStores;

const initStore = (core_store: TCoreStores, websocket: TWebSocket) => {
    if (root_store) return root_store;

    ServerTime.init(core_store.common);
    setWebsocket(websocket);
    root_store = new RootStore(core_store) as unknown as TCoreStores;

    return root_store;
};

export default initStore;
