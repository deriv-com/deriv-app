import { configure }        from 'mobx';
import Client               from '_common/base/client_base';
import NetworkMonitor       from 'Services/network-monitor';
import OutdatedBrowser      from 'Services/outdated-browser';
import RootStore            from 'Stores';
import { setStorageEvents } from 'Utils/Events/storage';

configure({ enforceActions: true });

const initStore = () => {
    Client.init();

    setStorageEvents();

    const root_store = new RootStore();

    NetworkMonitor.init(root_store);
    OutdatedBrowser.init(root_store);
    root_store.client.init();
    root_store.modules.trade.init();

    return root_store;
};

export default initStore;
