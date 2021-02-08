export type TClientProps = {
    is_logged_in: boolean;
    loginid: string;
};

export type TConfigProps = {
    asset_path: string;
    has_router: boolean;
    is_deriv_crypto: boolean;
    routes: TRoutesProps;
};

export type TRoutesProps = {
    home: string;
    about_us: string;
    explore: string;
    resources: string;

    market_commodities: string;
    market_forex: string;
    market_stock: string;
    market_synthetic: string;
    markets: string;

    platform_binary_bot: string;
    platform_dbot: string;
    platform_dmt5_synthetic: string;
    platform_dtrader: string;
    platform_smarttrader: string;
    platforms: string;

    trade_type_cdfs: string;
    trade_type_multipliers: string;
    trade_type_options: string;
    trade_types: string;

    wallet_bank_wire: string;
    wallet_cards: string;
    wallet_crypto: string;
    wallet_ewallet: string;
    wallets: string;
};

export interface TUIProps {
    height_offset: string;
    is_dark_mode_on: boolean;
    components: {
        LoginPrompt: React.ComponentType | React.ElementType | null;
        Page404: React.ComponentType | React.ElementType | null;
    };
}
