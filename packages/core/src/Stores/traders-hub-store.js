import { action, makeObservable, observable, reaction } from 'mobx';
import { getAppstorePlatforms } from '@deriv/shared';
import BaseStore from './base-store';

export default class TradersHubStore extends BaseStore {
    available_platforms = [];
    selected_region;
    selected_account_type = 'demo';
    is_tour_open = false;
    is_account_type_modal_visible = false;

    constructor(root_store) {
        super({ root_store });
        makeObservable(this, {
            available_platforms: observable,
            selected_account_type: observable,
            selected_region: observable,
            is_tour_open: observable,
            selectAccountType: action.bound,
            selectRegion: action.bound,
            toggleIsTourOpen: action.bound,
            toggleAccountTypeModalVisibility: action.bound,
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

    toggleAccountTypeModalVisibility() {
        this.is_account_type_modal_visible = !this.is_account_type_modal_visible;
    }
}
