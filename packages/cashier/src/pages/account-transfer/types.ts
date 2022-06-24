export type TAccountOption = {
    mt5_login_list: Array<{
        login: string;
        market_type: string;
        server_info: {
            geolocation: {
                region: string;
                sequence: string | number;
            };
        };
    }>;
    account: {
        balance?: string | number;
        currency?: string;
        disabled?: boolean;
        is_dxtrade?: boolean;
        is_mt?: boolean;
        market_type?: string;
        nativepicker_text: string;
        platform_icon?: string;
        text: JSX.Element | string;
        value?: string;
    };
    idx: string | number;
    is_dark_mode_on: boolean;
};
