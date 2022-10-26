import ConfigStore from 'Stores/config-store';
import TradingHubStore from 'Stores/trading-hub-store';

export type TRootStore = {
    ui: Record<string, any>;
    common: Record<string, any>;
    client: Record<string, any>;
    config: ConfigStore;
    modules: Record<string, any>;
    notifications: Record<string, any>;
    trading_hub_store: TradingHubStore;
};
