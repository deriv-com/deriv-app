import { action, makeObservable, observable, reaction, computed } from 'mobx';
import { getAppstorePlatforms } from '@deriv/shared';
import BaseStore from './base-store';

export default class TradersHubStore extends BaseStore {
    available_platforms = [];
    selected_region;
    selected_account_type = 'demo';
    is_tour_open = false;
    selected_platform_type = 'options';

    constructor(root_store) {
        super({ root_store });
        makeObservable(this, {
            available_platforms: observable,
            selected_account_type: observable,
            selected_platform_type: observable,
            selected_region: observable,
            is_tour_open: observable,
            selectAccountType: action.bound,
            selectRegion: action.bound,
            setTogglePlatformType: action.bound,
            toggleIsTourOpen: action.bound,
            has_any_real_account: computed,
        });

        reaction(
            () => [this.selected_account_type, this.selected_region],
            () => {
                this.getAvailablePlatforms();
            }
        );

        this.selected_region = 'Non-EU';
    }

    selectAccountType(account_type) {
        this.selected_account_type = account_type;
    }

    selectRegion(region) {
        this.selected_region = region;
    }

    toggleIsTourOpen(is_tour_open) {
        this.is_tour_open = is_tour_open;
    }

    getAvailablePlatforms() {
        const appstore_platforms = getAppstorePlatforms();
        if (this.root_store.client.isEuropeCountry() || this.selected_region === 'EU') {
            this.available_platforms = appstore_platforms.filter(platform =>
                ['EU', 'All'].some(region => region === platform.availability)
            );
            return;
        }
        this.available_platforms = appstore_platforms;
    }

    get has_any_real_account() {
        return this.selected_account_type === 'real' && this.root_store.client.has_active_real_account;
    }

    setTogglePlatformType(platform_type) {
        this.selected_platform_type = platform_type;
    }
}
