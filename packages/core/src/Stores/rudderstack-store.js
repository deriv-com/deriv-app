import { action } from 'mobx';
import { getAppId } from '@deriv/shared';
import { getLanguage } from '@deriv/translations';
import BinarySocket from '_common/base/socket_base';
import BaseStore from './base-store';

export default class RudderStackStore extends BaseStore {
    // only available on production (bot and deriv)
    is_applicable = /^(16929|19111|24091)$/.test(getAppId());
    has_identified = false;
    current_page = '';

    constructor(root_store) {
        super({ root_store });
    }

    @action.bound
    identifyEvent = async data =>
        new Promise(resolve => {
            if (this.is_applicable && !this.has_identified) {
                BinarySocket.wait('authorize').then(() => {
                    const user_id = this.root_store.client.user_id;
                    if (user_id) {
                        window.rudderanalytics.identify(user_id.toString(), {
                            language: getLanguage().toLowerCase(),
                            ...data,
                        });
                        this.has_identified = true;
                        this.pageView();

                        resolve();
                    }
                    resolve();
                });
            } else {
                resolve();
            }
        });

    /**
     * Pushes page view track event to rudderstack
     */
    @action.bound
    pageView() {
        const current_page = window.location.hostname + window.location.pathname;

        if (
            this.is_applicable &&
            this.root_store.client.is_logged_in &&
            this.has_identified &&
            current_page !== this.current_page
        ) {
            window.rudderanalytics.page('Deriv App', current_page);
            this.current_page = current_page;
        }
    }

    /**
     * Pushes reset event to rudderstack
     */
    @action.bound
    reset() {
        if (this.is_applicable) {
            window.rudderanalytics.reset();
            this.has_identified = false;
        }
    }

    /**
     * Pushes track event to rudderstack
     */
    @action.bound
    track(event_name, options) {
        if (this.is_applicable && this.has_identified) {
            window.rudderanalytics.track(event_name, options);
        }
    }
}
