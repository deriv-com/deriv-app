import ConfigStore from 'src/stores/config-store';

export type TRootStore = {
    ui: any;
    client: any;
    config: ConfigStore;
};
