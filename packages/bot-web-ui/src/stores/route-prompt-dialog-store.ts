import { action, makeObservable, observable } from 'mobx';
import { TStores } from '@deriv/stores/types';
import RootStore from './root-store';

export interface IRoutePromptDialogStore {
    should_show: boolean;
    is_confirmed: boolean;
    last_location: Location | null;
    shouldNavigateAfterPrompt: (next_location: Location) => boolean;
    setShoudShow: (should_show: boolean) => void;
    onConfirm: () => void;
    onCancel: () => void;
    continueRoute: () => void;
}

export default class RoutePromptDialogStore implements IRoutePromptDialogStore {
    root_store: RootStore;
    core: TStores;

    constructor(root_store: RootStore, core: TStores) {
        makeObservable(this, {
            should_show: observable,
            is_confirmed: observable,
            last_location: observable,
            shouldNavigateAfterPrompt: action.bound,
            onConfirm: action.bound,
            onCancel: action.bound,
            continueRoute: action.bound,
            setShoudShow: action.bound,
        });

        this.root_store = root_store;
        this.core = core;
    }

    should_show = false;
    is_confirmed = false;
    last_location: Location | null = null;

    shouldNavigateAfterPrompt(next_location: Location) {
        if (!this.is_confirmed) {
            this.last_location = next_location;
            if (next_location.pathname !== '/bot') this.should_show = true;
            return false;
        }

        return true;
    }

    setShoudShow(should_show: boolean) {
        this.should_show = should_show;
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
