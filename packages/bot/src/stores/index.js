import BotStore    from './bot-store';
import FlyoutStore from './flyout-store';
import ApiHelpers from '../services/api/helpers';

// Single instance so we can use it outside React.
export const flyout = new FlyoutStore();

export default class RootStore {
    constructor(core, ws) {
        this.bot = new BotStore(this);
        this.flyout = flyout;
        this.core = core;
        this.ws = ws;
        this.api_helpers = ApiHelpers.setInstance(this);
    }
}
