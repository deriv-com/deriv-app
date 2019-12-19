import { action }             from 'mobx';
import BinarySocket           from '_common/base/socket_base';
import { isLoginPages }       from '_common/base/login';
import { get as getLanguage } from '_common/language';
import BaseStore              from './base-store';
import { getAppId }           from '../config';

export default class SegmentStore extends BaseStore {
    // only available on production (bot and deriv)
    is_applicable = /^(16929|19111)$/.test(getAppId());
    has_identified = false;

    constructor(root_store) {
        super({ root_store });
    }

    /**
     * Pushes identify event to segment
     *
     * @param {object} data
     */
    @action.bound
    async identifyEvent(data) {
        if (this.is_applicable && !isLoginPages()) {
            BinarySocket.wait('authorize').then((response) => {
                if (response.authorize.user_id) {
                    window.analytics.identify(response.authorize.user_id, {
                        language: getLanguage().toLowerCase(),
                        ...data,
                    });
                    this.has_identified = true;
                }
            });
        }
    }

    /**
     * Pushes page view track event to segment
     */
    @action.bound
    pageView() {
        if (this.is_applicable && !isLoginPages() && this.root_store.client.is_logged_in && this.has_identified) {
            window.analytics.page();
        }
    }
    @action.bound
    reset() {
        if (this.is_applicable) {
            window.analytics.reset();
        }
    }
    @action.bound
    track(event_name, options = {}) {
        if (this.is_applicable && this.has_identified) {
            window.analytics.track(event_name, ...options);
        }
    }
}
