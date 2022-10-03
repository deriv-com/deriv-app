import React from 'react';
import { observable, action } from 'mobx';

const clearInjectionDiv = () => {
    const element = document.getElementById('load-strategy__blockly-container');
    if (element?.getElementsByClassName('injectionDiv').length > 1) {
        element.removeChild(element.getElementsByClassName('injectionDiv')[0]);
    }
};
export default class DashboardStore {
    constructor(root_store) {
        this.root_store = root_store;
    }

    @observable active_tab = 0;
    @observable active_tab_tutotials = 0;
    @observable faq_search_value = null;
    @observable dialog_options = {};
    @observable is_dialog_open = false;
    @observable getFileArray = [];
    @observable has_file_loaded = false;

    @action.bound
    setFileLoaded(has_file_loaded) {
        this.has_file_loaded = has_file_loaded;
        clearInjectionDiv();
    }

    @action.bound
    onCloseDialog() {
        this.is_dialog_open = false;
    }

    @action.bound
    showVideoDialog(url, type, component) {
        if (type === 'google') {
            this.dialog_options = {
                message: component,
            };
            return (this.is_dialog_open = true);
        } 
            if (url) {
                this.dialog_options = {
                    message: <video src={url} width='100%' height='100%' controls />,
                };
                return (this.is_dialog_open = true);
            }
        
        return (this.is_dialog_open = false);
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
