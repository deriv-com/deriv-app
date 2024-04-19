import { configure } from 'mobx';
import { excludeParamsFromUrlQuery, startPerformanceEventTimer } from '@deriv/shared';
import NetworkMonitor from 'Services/network-monitor';
import RootStore from 'Stores';

configure({ enforceActions: 'observed' });

const setStorageEvents = root_store => {
    window.addEventListener('storage', evt => {
        switch (evt.key) {
            case 'client.accounts': {
                const active_loginid = root_store.client.loginid;
                const new_currency = JSON.parse(evt.newValue)?.[active_loginid]?.currency;
                const old_currency = JSON.parse(evt.oldValue)?.[active_loginid]?.currency;

                if (document.hidden && new_currency && old_currency !== new_currency) {
                    root_store.client.updateAccountCurrency(new_currency, false);
                }
                break;
            }
            case 'active_loginid':
                if (localStorage.getItem('active_loginid') === 'null' || !localStorage.getItem('active_loginid')) {
                    root_store.client.logout();
                }
                if (document.hidden) {
                    window.location.reload();
                }
                break;
            // no default
        }
    });
};

const startPerformanceMetrics = (url_query_string, url_params) => {
    // start the timer for signup
    if (url_params.get('action') === 'signup') startPerformanceEventTimer('signup_time');

    // start the timer for login
    if (url_params.get('acct1')) startPerformanceEventTimer('login_time');

    // start the timer for redirect from deriv.com
    if (url_params.get('redirect_from') === 'deriv_com') {
        startPerformanceEventTimer('redirect_from_deriv_com_time');

        // remove 'redirect_from' query param
        history.replaceState(
            null,
            null,
            window.location.href.replace(
                `${url_query_string}`,
                excludeParamsFromUrlQuery(url_query_string, ['redirect_from'])
            )
        );
    }
};

const initStore = notification_messages => {
    // Check Endpoint from URL need to be done before initializing store to avoid
    // race condition with setting up user session from URL
    const url_query_string = window.location.search;
    const url_params = new URLSearchParams(url_query_string);
    // start timers to measure performance
    startPerformanceMetrics(url_query_string, url_params);

    if (url_params.get('action') === 'signup') {
        // If a user comes from the signup process,
        // we need to give him a clean setup
        const server_url = localStorage.getItem('config.server_url');
        const app_id = localStorage.getItem('config.app_id');

        localStorage.clear();

        if (server_url) localStorage.setItem('config.server_url', server_url);
        if (app_id) localStorage.setItem('config.app_id', app_id);
    }

    const root_store = new RootStore();

    setStorageEvents(root_store);

    NetworkMonitor.init(root_store);
    root_store.client.init();
    root_store.common.init();
    root_store.ui.init(notification_messages);

    return root_store;
};

export default initStore;
