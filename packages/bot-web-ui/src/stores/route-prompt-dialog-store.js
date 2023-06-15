import { action, makeObservable, observable } from 'mobx';

export default class RoutePromptDialogStore {
    constructor(root_store, core) {
        makeObservable(this, {
            should_show: observable,
            is_confirmed: observable,
            last_location: observable,
            shouldNavigateAfterPrompt: action.bound,
            onConfirm: action.bound,
            onCancel: action.bound,
            continueRoute: action.bound,
        });

        this.root_store = root_store;
        this.core = core;
    }

    should_show = false;
    is_confirmed = false;
    last_location = null;

    shouldNavigateAfterPrompt(next_location) {
        if (!this.is_confirmed) {
            this.last_location = next_location;
            this.should_show = true;
            return false;
        }

        return true;
    }

    onConfirm() {
        this.should_show = false;
        this.is_confirmed = true;
    }

    onCancel() {
        this.should_show = false;
    }

    continueRoute() {
        const { common } = this.core;
        if (this.is_confirmed && this.last_location) common.routeTo(this.last_location.pathname);
    }
}
