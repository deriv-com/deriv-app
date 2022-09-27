import { observable, action } from 'mobx';

export default class DashboardStore {
    constructor(root_store) {
        this.root_store = root_store;
    }

    @observable active_tab = 0;
    @observable is_info_panel_visible = true;

    @action.bound
    setActiveTab(active_tab) {
        this.active_tab = active_tab;
    }

    @action.bound
    setInfoPanelVisibility(visibility) {
        this.is_info_panel_visible = visibility;
    }
}
