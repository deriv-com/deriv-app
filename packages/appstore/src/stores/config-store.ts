import { TConfigProps } from 'Types';
import BaseStore from './base-store';

export default class ConfigStore extends BaseStore {
    public has_router = true;
    public routes = {
        traders_hub: '/appstore/traders-hub',
        onboarding: '/appstore/onboarding',

        my_apps: '/my-apps',
        explore: '/explore',
        about_us: '/about-us',
        resources: '/resources',

        market_commodities: '/markets/commodities',
        market_forex: '/markets/forex',
        market_stock: '/markets/stock',
        market_synthetic: '/markets/synthetic',
        markets: '/markets',

        platform_binary_bot: '/platforms/binary-bot',
        platform_dbot: '/platforms/dbot',
        platform_dmt5: '/platforms/dmt5',
        platform_dmt5_financial: '/platforms/dmt5-financial',
        platform_dmt5_financial_stp: '/platforms/dmt5-financial-stp',
        platform_dmt5_synthetic: '/platforms/dmt5-synthetic',
        platform_dtrader: '/platforms/dtrader',
        platform_smarttrader: '/platforms/smarttrader',
        platforms: '/platforms',

        trade_type_cfds: '/trade-types/cfds',
        trade_type_multipliers: '/trade-types/multipliers',
        trade_type_options: '/trade-types/options',
        trade_types: '/trade-types',

        wallet_bank_wire: '/wallets/bank-wire',
        wallet_cards: '/wallets/cards',
        wallet_crypto: '/wallets/crypto',
        wallet_ewallet: '/wallets/ewallet',
        wallets: '/wallets',
    };

    public setConfig(config: TConfigProps): void {
        this.has_router = config.has_router;
        this.routes = config.routes;
    }
}
