import { computed, observable, action, makeObservable } from 'mobx';
import config_data from '../strategies/default.json';
import { getSetting, storeSetting } from 'Utils/settings';
import RootStore from './root-store';
import {
    TMarket,
    TMarketDropdown,
    TMarketOption,
    TDropdowns,
    TSelectedValuesSelect,
    TQSCache,
} from '../components/blocks/blocks.types';

export default class BlocksStore {
    root_store: RootStore;
    qs_cache: TQSCache = (getSetting('strategy') as TQSCache) || {};

    constructor(root_store: RootStore) {
        makeObservable(this, {
            selected_market: observable,
            initial_values: computed,
            markets_dropdown: observable,
            setTypesMarketsDropdown: action.bound,
            loadDataStrategy: action.bound,
            updateTypesMarketsDropdown: action.bound,
        });

        this.root_store = root_store;
    }

    selected_market: TMarket = (this.qs_cache.selected_market as TMarket) || {};
    markets_dropdown: TMarketDropdown = [];

    get initial_values() {
        const init = {
            market: this.getFieldValue(this.markets_dropdown, this.selected_market.value) || '',
        };
        storeSetting('strategy', this.qs_cache);

        return init;
    }

    setTypesMarketsDropdown(types_markets_options: TMarketOption): void {
        this.markets_dropdown = types_markets_options;
    }

    async updateTypesMarketsDropdown() {
        const {
            settings: { markets },
        } = config_data;

        const types_markets = Object.values(markets).map(m => ({
            index: m.index,
            text: m.label,
            value: m.label,
        }));

        this.setTypesMarketsDropdown(types_markets);

        let first_market = types_markets[0];
        if (this.selected_market && markets.some(e => e.value === this.selected_market.value)) {
            first_market = this.selected_market;
            runInAction(() => {
                first_types_markets.text = this.getFieldValue(markets, this.selected_market.value);
            });
        } else {
            delete this.qs_cache.selected_market;
        }
        if (first_market) {
            // !TODO this.setSelectedMarket(first_market);
        }
    }

    async loadDataStrategy() {
        await this.updateTypesMarketsDropdown();
    }

    getFieldValue = (list_items: TDropdowns, value: string): string => {
        const list_obj: TSelectedValuesSelect =
            list_items?.find(item =>
                typeof item.value !== 'string'
                    ? item.value === value
                    : item.value?.toLowerCase() === value?.toLowerCase()
            ) || {};

        return typeof list_obj !== 'string' ? list_obj?.text : '';
    };

    exportStrategyToJson = data => {
        const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(data))}`;
        const link = document.createElement('a');
        link.href = jsonString;
        link.download = 'strategy.json';

        link.click();
    };
}
