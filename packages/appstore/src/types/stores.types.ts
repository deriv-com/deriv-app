import ConfigStore from 'Stores/config-store';

export type TRootStore = {
    ui: Record<string, unknown>;
    client: Record<string, unknown>;
    config: ConfigStore;
};
