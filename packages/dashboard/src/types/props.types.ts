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
    platform_dmt5_synthetic: string;
};

export interface TUIProps {
    height_offset: string;
    is_dark_mode_on: boolean;
    components: {
        LoginPrompt: React.ComponentType | React.ElementType | null;
        Page404: React.ComponentType | React.ElementType | null;
    };
}

export type TStringTranslation = string | React.ReactElement

// ref: https://www.carlrippon.com/react-children-with-typescript/
export type TReactChildren = React.ReactNode;
