import { configure } from 'mobx';

import NetworkMonitor from 'Services/network-monitor';
// import OutdatedBrowser      from 'Services/outdated-browser';
import RootStore from 'Stores';

configure({ enforceActions: 'observed' });

const setStorageEvents = root_store => {
    window.addEventListener('storage', evt => {
        switch (evt.key) {
            case 'active_loginid':
                if (document.hidden) {
                    window.location.reload();
                }
                break;
            case 'reality_check_dismissed':
                if (document.hidden) {
                    // if new value is true, hide reality check, otherwise show it
                    root_store.client.setVisibilityRealityCheck(!JSON.parse(evt.newValue));
                }
                break;
            // no default
        }
    });
};

const initStore = notification_messages => {
    const root_store = new RootStore();

    setStorageEvents(root_store);

    NetworkMonitor.init(root_store);
    // TODO: Re-enable and update browser checking
    // OutdatedBrowser.init(root_store);!
    root_store.client.init();
    root_store.ui.init(notification_messages);
    root_store.pushwoosh.init();

    return root_store;
};

export default initStore;
