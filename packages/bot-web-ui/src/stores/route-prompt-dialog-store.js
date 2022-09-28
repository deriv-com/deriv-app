import { observable, action } from 'mobx';

export default class RoutePromptDialogStore {
    constructor(root_store) {
        this.root_store = root_store;
    }

    @observable should_show = false;
    @observable is_confirmed = false;
    @observable last_location = null;

    @action.bound
    shouldNavigateAfterPrompt(next_location) {
        if (!this.is_confirmed) {
            this.last_location = next_location;
            this.should_show = true;
            return false;
        }

        return true;
    }

    @action.bound
    onConfirm() {
        this.should_show = false;
        this.is_confirmed = true;
    }

    @action.bound
    onCancel() {
        this.should_show = false;
    }

    @action.bound
    continueRoute() {
        if (this.is_confirmed && this.last_location) this.root_store.common.routeTo(this.last_location.pathname);
    }
}
