import { observable, action } from 'mobx';
import { getSetting, storeSetting } from '../utils/settings';

export default class BotSettingsStore {
    constructor(root_store) {
        this.root_store = root_store;
    }

    @observable should_restart_on_buy_sell_error = getSetting('restart_on_buy_sell_error') || false;
    @observable should_restart_on_last_trade_error = getSetting('restart_on_last_trade_error') || true;

    @action.bound
    setRestartOnBuySellError(should_restart) {
        this.should_restart_on_buy_sell_error = should_restart;
        storeSetting('restart_on_buy_sell_error', should_restart);
    }

    @action.bound
    setRestartOnLastTradeError(should_restart) {
        this.should_restart_on_last_trade_error = should_restart;
        storeSetting('restart_on_last_trade_error', should_restart);
    }
}
