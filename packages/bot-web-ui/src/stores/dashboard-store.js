import React from 'react';
import { observable, action } from 'mobx';

export default class DashboardStore {
    constructor(root_store) {
        this.root_store = root_store;
    }

    @observable active_tab = 0;
    @observable active_tab_tutotials = 0;
    @observable faq_search_value = null;
    @observable dialog_options = {};
    @observable is_dialog_open = false;

    @action.bound
    onCloseDialog() {
        this.is_dialog_open = false;
    }

    @action.bound
    showVideoDialog(url) {
        this.is_dialog_open = false;
        if (url) {
            this.dialog_options = {
                message: <video src={url} width='100%' height='100%' controls />,
            };
            this.is_dialog_open = true;
        }
        return this.is_dialog_open;
    }

    @action.bound
    setActiveTab(active_tab) {
        this.active_tab = active_tab;
    }

    @action.bound
    setActiveTabTutorial(active_tab_tutotials) {
        this.active_tab_tutotials = active_tab_tutotials;
    }

    @action.bound
    setFAQSearchValue(faq_search_value) {
        this.faq_search_value = faq_search_value;
    }
}
