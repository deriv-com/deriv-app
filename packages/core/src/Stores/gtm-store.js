import {
    action,
    computed }              from 'mobx';
import BinarySocket           from '_common/base/socket_base';
import { isLoginPages }       from '_common/base/login';
import { get as getLanguage } from '_common/language';
import BaseStore              from './base-store';
import { getAppId }           from '../config';

export default class GTMStore extends BaseStore {
    is_gtm_applicable = /^(16303|16929)$/.test(getAppId());

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
                userId   : this.root_store.client.user_id,
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
    async pushDataLayer(data) {
        if (this.is_gtm_applicable && !isLoginPages()) {
            BinarySocket.wait('authorize').then(() => {
                dataLayer.push({
                    ...this.common_variables,
                    ...data,
                });
            });
        }
    }

    @action.bound
    pushPurchaseData(contract_data) {
        const data = {
            event   : 'buy_contract',
            bom_ui  : 'new',
            contract: {
                amount       : contract_data.amount,
                barrier1     : contract_data.barrier,
                barrier2     : contract_data.barrier2,
                basis        : contract_data.basis,
                buy_price    : contract_data.buy_price,
                contract_type: contract_data.contract_type,
                currency     : contract_data.currency,
                date_expiry  : contract_data.date_expiry,
                date_start   : contract_data.date_start,
                duration     : contract_data.duration,
                duration_unit: contract_data.duration_unit,
                payout       : contract_data.payout,
                symbol       : contract_data.symbol,
            },
            settings: {
                theme           : this.root_store.ui.is_dark_mode_on ? 'dark' : 'light',
                positions_drawer: this.root_store.ui.is_positions_drawer_on ? 'open' : 'closed',
                // purchase_confirm: this.root_store.ui.is_purchase_confirm_on ? 'enabled' : 'disabled',
                chart           : {
                    toolbar_position: this.root_store.ui.is_chart_layout_default ? 'bottom' : 'left',
                    chart_asset_info: this.root_store.ui.is_chart_asset_info_visible ? 'visible' : 'hidden',
                    // chart_type      : this.root_store.modules.smart_chart.chart_type,
                    // granularity     : this.root_store.modules.smart_chart.granularity,
                },
            },
        };
        this.pushDataLayer(data);
    }

    @action.bound
    setLoginFlag(event_name) {
        if (this.is_gtm_applicable) {
            localStorage.setItem('GTM_login', event_name);
        }
    }
}
