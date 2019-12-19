import { action }       from 'mobx';
import { getLanguage }  from 'deriv-translations';
import BinarySocket     from '_common/base/socket_base';
import { isLoginPages } from '_common/base/login';
import BaseStore        from './base-store';
import { getAppId }     from '../config';

export default class SegmentStore extends BaseStore {
    // only available on production (bot and deriv)
    is_applicable = /^(16929|19111)$/.test(getAppId());
    has_identified = false;

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
    async identifyEvent(data) {
        if (this.is_applicable && !isLoginPages() && !this.has_identified) {
            BinarySocket.wait('authorize').then((response) => {
                if (response.authorize.user_id) {
                    window.analytics.identify(response.authorize.user_id, {
                        language: getLanguage().toLowerCase(),
                        ...data,
                    });
                    this.has_identified = true;
                    this.pageView();
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

    /**
     * Pushes reset event to segment
     * segment will remove userId from localstorage when logout
     */
    @action.bound
    reset() {
        if (this.is_applicable) {
            window.analytics.reset();
        }
    }

    /**
     * Pushes track event to segment
     */
    @action.bound
    track(event_name, options = {}) {
        if (this.is_applicable && this.has_identified) {
            window.analytics.track(event_name, ...options);
        }
    }
}
