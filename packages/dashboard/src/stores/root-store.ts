import { MT5Store } from '@deriv/trader';
import ClientStore from './client-store';
import ConfigStore from './config-store';
import UIStore from './ui-store';

export default class RootStore {
    public ui_store: UIStore;
    public client_store: ClientStore;
    public config_store: ConfigStore;
    public mt5_store: unknown;
    public ws: unknown;

    public constructor(ws: unknown) {
        this.ws = ws;
        this.ui_store = new UIStore(this);
        this.client_store = new ClientStore(this);
        this.config_store = new ConfigStore(this);
        this.mt5_store = new MT5Store({
            root_store: { ui: this.ui_store, client: this.client_store, config: this.config_store },
        });
    }
}
