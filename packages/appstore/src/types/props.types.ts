import ConfigStore from 'Stores/config-store';

export type TConfigProps = {
    has_router: boolean;
    routes: ConfigStore['routes'];
};
