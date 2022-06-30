import { observable, action, makeObservable } from 'mobx';

export default class RoutePromptDialogStore {
    constructor(root_store) {
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
        if (this.is_confirmed && this.last_location) this.root_store.common.routeTo(this.last_location.pathname);
    }
}
