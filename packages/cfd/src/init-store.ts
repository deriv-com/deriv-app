import { configure } from 'mobx';
import RootStore from './Stores';
import { setWebsocket } from '@deriv/shared';
import ServerTime from '_common/base/server_time';
import type { TCoreStores } from '@deriv/stores/types';
import { TWebSocket } from '../types';

configure({ enforceActions: 'observed' });

let root_store: TCoreStores;

const initStore = (core_store: TCoreStores, websocket: TWebSocket) => {
    if (root_store) return root_store;

    ServerTime.init(core_store.common);
    setWebsocket(websocket);
    root_store = new RootStore(core_store) as RootStore & {
        menu: TCoreStores['menu'];
        portfolio: TCoreStores['portfolio'];
        contract_trade: TCoreStores['contract_trade'];
    };

    return root_store;
};

export default initStore;
