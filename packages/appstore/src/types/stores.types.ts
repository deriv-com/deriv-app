import { TConfigProps, TRoutesProps } from 'Types';

export type TConfigStore = {
    asset_path: string;
    has_router: boolean;
    redirect_404?: string;
    routes: TRoutesProps;
    setConfig: (config: TConfigProps) => void;
};

export type TRootStore = {
    ui: any;
    client: any;
    config: TConfigStore;
};
