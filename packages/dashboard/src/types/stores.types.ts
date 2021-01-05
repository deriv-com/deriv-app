import { TClientProps, TConfigProps, TRoutesProps, TUIProps } from 'Types';

export type TClientStore = {
    init: (client_props: TClientProps) => void;
};

export type TConfigStore = {
    asset_path: string;
    has_router: boolean;
    is_deriv_crypto: boolean;
    redirect_404?: string;
    routes: TRoutesProps;
    setConfig: (config: TConfigProps) => void;
};

export type TRootStore = {
    ui_store: TUIStore;
    client_store: TClientStore;
    config_store: TConfigStore;
};

export type TUIStore = {
    components: {
        LoginPrompt?: React.ComponentType | React.ElementType;
        Page404?: React.ComponentType | React.ElementType;
    };
    is_dark_mode_on: boolean;
    init: (ui_props: TUIProps) => void;
};
