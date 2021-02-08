import { TConfigProps, TRoutesProps } from 'Types';
import BaseStore from './base-store';

export default class ConfigStore extends BaseStore {
    public has_router = false;
    public is_deriv_crypto = false;
    public asset_path = '';
    public routes: TRoutesProps = {
        home: '/',
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
        platform_dmt5_synthetic: '/platforms/dmt5_synthetic',
        platform_dtrader: '/platforms/dmt5_synthetic',
        platform_smarttrader: '/platforms/smarttrader',
        platforms: '/platforms',

        trade_type_cdfs: '/trade-types/cdfs',
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
        this.is_deriv_crypto = config.is_deriv_crypto;
        this.asset_path = config.asset_path;
        this.routes = config.routes;
    }
}
