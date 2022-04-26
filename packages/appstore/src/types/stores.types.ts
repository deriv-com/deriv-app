import ConfigStore from 'Stores/config-store';

export type TRootStore = {
    ui: any;
    client: any;
    config: ConfigStore;
};
