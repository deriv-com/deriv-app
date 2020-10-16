import { action } from 'mobx';
import { getAppId } from '@deriv/shared';
import { getLanguage } from '@deriv/translations';
import BinarySocket from '_common/base/socket_base';
import BaseStore from './base-store';

export default class SegmentStore extends BaseStore {
    // only available on production (bot and deriv)
    is_applicable = /^(16929|19111)$/.test(getAppId());
    has_identified = false;
    current_page = '';

    constructor(root_store) {
        super({ root_store });
    }

    /**
     * Pushes identify event to segment
     * identify event will store userid in localstorage to be used by
     * other segment call
     * @param {object} data
     */
    @action.bound
    identifyEvent = async data =>
        new Promise(resolve => {
            if (this.is_applicable && !this.has_identified) {
                BinarySocket.wait('authorize').then(() => {
                    const user_id = this.root_store.client.user_id;
                    if (user_id) {
                        window.analytics.identify(user_id, {
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
     * Pushes page view track event to segment
     */
    @action.bound
    pageView() {
        const current_page = window.location.href;

        if (
            this.is_applicable &&
            this.root_store.client.is_logged_in &&
            this.has_identified &&
            current_page !== this.current_page
        ) {
            window.analytics.page();
            this.current_page = current_page;
        }
    }

    /**
     * Pushes reset event to segment
     * segment will remove userId from localstorage when logout
     */
    @action.bound
    reset() {
        if (this.is_applicable) {
            window.analytics.reset();
            this.has_identified = false;
        }
    }

    /**
     * Pushes track event to segment
     */
    @action.bound
    track(event_name, options) {
        if (this.is_applicable && this.has_identified) {
            window.analytics.track(event_name, options);
        }
    }
}
