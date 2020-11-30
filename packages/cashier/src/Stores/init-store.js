import { configure } from 'mobx';
import { setWebsocket } from 'Services/ws-methods';
import CashierStore from './Cashier/cashier-store';
import RootStore from './index';

configure({ enforceActions: 'observed' });

const initStore = (core_store, websocket) => {
    setWebsocket(websocket);
    const root_store = new RootStore(core_store);
    root_store.modules.cashier = new CashierStore();

    root_store.modules.cashier.init();

    return root_store;
};

export default initStore;
