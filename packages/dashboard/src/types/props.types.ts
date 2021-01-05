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
    dmt5: string;
    dtrader: string;
    dbot: string;
    smarttrader: string;
    binary_bot: string;
    cfds: string;
    multipliers: string;
    options: string;
    forex: string;
    synthetic_indices: string;
    stock_indices: string;
    commodities: string;
};

export interface TUIProps {
    height_offset: string;
    is_dark_mode_on: boolean;
    components: {
        LoginPrompt: React.ComponentType | React.ElementType | null;
        Page404: React.ComponentType | React.ElementType | null;
    };
}
