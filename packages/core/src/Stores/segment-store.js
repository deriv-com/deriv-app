import {
    action,
    computed }                  from 'mobx';
import BinarySocket             from '_common/base/socket_base';
import { isLoginPages }         from '_common/base/login';
import { get as getLanguage }   from '_common/language';
import BaseStore                from './base-store';
import { getAppId }             from '../config';

export default class SegmentStore extends BaseStore {
    // only available on production
    is_applicable = /^(16929)$/.test(getAppId());
    language = getLanguage().toLowerCase()

    constructor(root_store) {
        super({ root_store });
    }

    /**
     * Contains binary user id
     *
     * @returns {object}
     */
    @computed
    get userId() {
        return this.root_store.client.user_id;
    }

    /**
     * Contains event traits that will be passed to segment
     *
     * @returns {object}
     */
    @computed
    get common_traits() {
        return {
            language: this.language,
        };
    }

    /**
     * Pushes identify event to segment
     *
     * @param {object} data
     */
    @action.bound
    async identifyEvent(data) {
        if (this.is_applicable && !isLoginPages()) {
            BinarySocket.wait('authorize').then(() => {
                window.analytics.identify(this.userId, {
                    ...this.common_traits,
                    ...data,
                });
            });
        }
    }

    /**
     * Pushes page view track event to segment
     */
    @action.bound
    pageView() {
        if (this.is_applicable && !isLoginPages() && this.root_store.client.is_logged_in) {
            window.analytics.page();
        }
    }
}
