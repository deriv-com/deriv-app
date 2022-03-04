export type TConfigProps = {
    asset_path: string;
    has_router: boolean;
    routes: TRoutesProps;
};

export type TRoutesProps = {
    home: string;
    my_apps: string;
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
    platform_dmt5: string;
    platform_dmt5_financial: string;
    platform_dmt5_financial_stp: string;
    platform_dmt5_synthetic: string;
    platform_dtrader: string;
    platform_smarttrader: string;
    platforms: string;

    trade_type_cfds: string;
    trade_type_multipliers: string;
    trade_type_options: string;
    trade_types: string;

    wallet_bank_wire: string;
    wallet_cards: string;
    wallet_crypto: string;
    wallet_ewallet: string;
    wallets: string;
};

type ReactTypes = React.ComponentType | React.ElementType;

type TLocalizeProps = {
    components?: ReactTypes[];
    i18n?: unknown;
    i18n_default_text: string;
    values?: {
        [k: string]: string;
    };
};

export type TStringTranslation = string | React.ReactElement<TLocalizeProps>;

// ref: https://www.carlrippon.com/react-children-with-typescript/
export type TReactChildren = React.ReactNode;
