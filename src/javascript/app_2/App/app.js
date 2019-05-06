import { configure }        from 'mobx';
import React                from 'react';
import { render }           from 'react-dom';
import Client               from '_common/base/client_base';
import NetworkMonitor       from 'Services/network-monitor';
import OutdatedBrowser      from 'Services/outdated-browser';
import RootStore            from 'Stores';
import { setStorageEvents } from 'Utils/Events/storage';
import App                  from './app.jsx';

configure({ enforceActions: true });

const initApp = () => {
    Client.init();

    setStorageEvents();

    const root_store = new RootStore();

    NetworkMonitor.init(root_store);
    OutdatedBrowser.init(root_store);
    root_store.client.init();
    root_store.modules.trade.init();

    const app = document.getElementById('binary_app');

    if (app) {
        render(<App root_store={root_store} />, app);
    }
};

export default initApp;
