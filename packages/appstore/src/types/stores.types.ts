import ConfigStore from 'Stores/config-store';

export type TRootStore = {
    ui: Record<string, any>;
    client: Record<string, any>;
    config: ConfigStore;
};
