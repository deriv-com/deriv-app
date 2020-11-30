import { configure } from 'mobx';
import { setWebsocket } from 'Services/ws-methods';
import CashierStore from './Cashier/cashier-store';

configure({ enforceActions: 'observed' });

const initStore = (core_store, websocket) => {
    setWebsocket(websocket);
    core_store.modules.attachModule('cashier', new CashierStore({ root_store: core_store }));
    core_store.modules.cashier.init();

    return core_store;
};

export default initStore;
