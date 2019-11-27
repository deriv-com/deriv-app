import {
    action,
    computed }                    from 'mobx';
import BinarySocket               from '_common/base/socket_base';
import { isLoginPages }           from '_common/base/login';
import { get as getLanguage }     from '_common/language';
import BaseStore                  from './base-store';
import { isProduction }           from '../config';

export default class SegmentStore extends BaseStore {
    constructor(root_store) {
        super({ root_store });

        if (isProduction()) {
            analytics.load("TSvHCi93nNiBjfezt24XMMDa2YOwUoqS"); // Production Token
        } else {
            analytics.load("KD5463ad4XabNttNNaAC0zMLie7g9GIM"); // Development Token
        }
    }

    /**
     * Contains event traits that will be passed to segment
     *
     * @returns {object}
     */
    @computed
    get common_traits() {
        return {
            user_id : this.root_store.client.user_id,
            language: getLanguage().toLowerCase(),
        };
    }

    /**
     * Pushes identify event to segment
     *
     * @param {object} data
     */
    @action.bound
    async identifyEvent(data) {
        if (!isLoginPages()) {
            BinarySocket.wait('authorize').then(() => {
                window.analytics.identify(this.common_traits.user_id, {
                    language: this.common_traits.language,
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
        BinarySocket.wait('authorize').then(() => {
            if (!isLoginPages() && this.root_store.client.is_logged_in) {
                window.analytics.page();
            }
        });
    }
}
