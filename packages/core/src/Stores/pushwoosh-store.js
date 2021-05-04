import { action } from 'mobx';
import { Pushwoosh } from 'web-push-notifications';
import { getAppId, urlForCurrentDomain } from '@deriv/shared';
import { getLanguage } from '@deriv/translations';
import BaseStore from './base-store';

export default class PushwooshStore extends BaseStore {
    // only available on staging & production (bot and deriv)
    is_applicable = /^(16929|19111|24091|16303)$/.test(getAppId());
    has_initialized = false;
    push_woosh = new Pushwoosh();

    constructor(root_store) {
        super({ root_store });
    }

    /**
     * Pushes initialize event to pushwoosh
     */
    @action.bound
    init = () => {
        if (!this.is_applicable && this.has_initialized) return;

        this.push_woosh.push([
            'init',
            {
                logLevel: 'error', // or info or debug
                applicationCode: 'DD293-35A19',
                safariWebsitePushID: 'web.com.deriv',
                defaultNotificationTitle: 'Deriv.com',
                defaultNotificationImage: urlForCurrentDomain('https://deriv.com/favicons/favicon-192x192.png'),
                autoSubscribe: true,
                serviceWorkerUrl: '/service-worker.js',
            },
        ]);
        this.has_initialized = true;

        this.push_woosh.push([
            'onReady',
            api => {
                this.push_woosh.isSubscribed().then(is_subscribed => {
                    if (!is_subscribed) {
                        this.push_woosh.subscribe();
                    }
                });
                this.sendTags(api);
            },
        ]);
    };

    /**
     * Set tags containing client to pushwoosh
     */
    @action.bound
    sendTags = api => {
        api.getTags()
            .then(result => {
                if (!result.result['Login ID'] || !result.result['Site Language'] || !result.result.Residence) {
                    return api.setTags({
                        'Login ID': this.root_store.client.loginid,
                        'Site Language': getLanguage().toLowerCase(),
                        Residence: this.root_store.client.residence,
                    });
                }
                return null;
            })
            .catch(e => {
                // eslint-disable-next-line no-console
                console.error(e);
                return null;
            });
    };
}
