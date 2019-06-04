import {
    action,
    computed,
    observable }              from 'mobx';
import BaseStore              from './base-store';
import { isLoginPages }       from '../../_common/base/login';
import { get as getLanguage } from '../../_common/language';
import { getAppId }           from '../../config';

export default class GTMStore extends BaseStore {
    @observable is_gtm_applicable = /^(16303|16929)$/.test(getAppId());

    constructor(root_store) {
        super({ root_store });

        this.onSwitchAccount(this.accountSwitcherListener);
    }

    @computed
    get visitorId() {
        return this.root_store.client.loginid;
    }

    @computed
    get currency() {
        return this.root_store.client.currency;
    }

    /**
     * Contains common data that will be passed to GTM on each datalayer push
     *
     * @returns {object}
     */
    @computed
    get common_variables() {
        return {
            language: getLanguage(),
            ...this.root_store.client.is_logged_in && {
                visitorId: this.visitorId,
                currency : this.currency,
            },
            ...this.root_store.ui.is_dark_mode_on && {
                theme: this.root_store.ui.is_dark_mode_on ? 'dark' : 'light',
            },
        };
    }

    @action.bound
    accountSwitcherListener() {
        return new Promise(async (resolve) => resolve(this.pushDataLayer({ event: 'account switch' })));
    }

    /**
     * Pushes provided data as GTM DataLayer
     *
     * @param {object} data
     */
    @action.bound
    pushDataLayer(data) {
        if (this.is_gtm_applicable && !isLoginPages()) {
            dataLayer.push({
                ...this.common_variables,
                ...data,
            });
        }
    }
}
