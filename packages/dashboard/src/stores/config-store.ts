import { TConfigProps, TRoutesProps } from 'Types';
import BaseStore from './base-store';

export default class ConfigStore extends BaseStore {
    public has_router = false;
    public asset_path = '';
    public routes: TRoutesProps = {
        home: '/',
        explore: '/explore',
        about_us: '/about-us',
        resources: '/resources',
        platform_dmt5_synthetic: '/platforms/dmt5_synthetic',
    };

    public setConfig(config: TConfigProps): void {
        this.has_router = config.has_router;
        this.asset_path = config.asset_path;
        this.routes = config.routes;
    }
}
