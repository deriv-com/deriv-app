import ConfigStore from 'Stores/config-store';

export type TRootStore = {
    ui: Record<string, any>;
    common: Record<string, any>;
    client: Record<string, any>;
    config: ConfigStore;
    modules: Record<string, any>;
    notifications: Record<string, any>;
    traders_hub: Record<string, any>;
};
