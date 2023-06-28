import { action, makeObservable, observable } from 'mobx';
import { onWorkspaceResize } from '@deriv/bot-skeleton';
import { tabs_title } from 'Constants/bot-contents';
import { getSetting, storeSetting } from 'Utils/settings';
import RootStore from './root-store';

export interface IBlocklyStore {
    is_loading: boolean;
    active_tab: string;
    setActiveTab: (tab: string) => void;
    setContainerSize: () => void;
    onMount: () => void;
    onUnmount: () => void;
    setLoading: () => void;
    getCachedActiveTab: () => void;
}

export default class BlocklyStore implements IBlocklyStore {
    root_store: RootStore;

    constructor(root_store: RootStore) {
        makeObservable(this, {
            is_loading: observable,
            active_tab: observable,
            setActiveTab: action.bound,
            setContainerSize: action.bound,
            onMount: action.bound,
            getCachedActiveTab: action.bound,
            onUnmount: action.bound,
            setLoading: action.bound,
        });
        this.root_store = root_store;
    }

    is_loading = false;

    active_tab = tabs_title.WORKSPACE;

    setActiveTab(tab: string): void {
        this.active_tab = tab;
        storeSetting('active_tab', this.active_tab);
    }

    setContainerSize(): void {
        if (this.active_tab === tabs_title.WORKSPACE) {
            onWorkspaceResize();
        }
    }

    onMount(): void {
        window.addEventListener('resize', this.setContainerSize);
    }

    getCachedActiveTab(): void {
        if (getSetting('active_tab')) {
            this.active_tab = getSetting('active_tab');
        }
    }

    onUnmount(): void {
        window.removeEventListener('resize', this.setContainerSize);
    }

    setLoading(is_loading: boolean): void {
        this.is_loading = is_loading;
    }
}
