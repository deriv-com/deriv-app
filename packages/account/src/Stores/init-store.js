import { configure } from 'mobx';
import { setWebsocket } from '@deriv/shared';
import RootStore from 'Stores';

configure({ enforceActions: 'observed' });

const initStore = (core_store, websocket) => {
    setWebsocket(websocket);
    return new RootStore(core_store);
};

export default initStore;
