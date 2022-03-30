import { TConfigProps } from 'Types';
import BaseStore from './base-store';

export default class ConfigStore extends BaseStore {
    public has_router = false;
    public routes = {
        trading_hub: '/appstore/trading-hub',
    };

    public setConfig(config: TConfigProps): void {
        this.has_router = config.has_router;
        this.routes = config.routes;
    }
}
