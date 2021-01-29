import { TConfigProps, TRoutesProps } from 'Types';
import BaseStore from './base-store';

export default class ConfigStore extends BaseStore {
    public has_router = false;
    public is_deriv_crypto = false;
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
        this.is_deriv_crypto = config.is_deriv_crypto;
        this.asset_path = config.asset_path;
        this.routes = config.routes;
    }
}
