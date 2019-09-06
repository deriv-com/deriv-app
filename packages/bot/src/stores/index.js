import BotStore     from './bot-store';
import FlyoutStore  from './flyout-store';
import ToolbarStore from './toolbar-store';

// Single instance so we can use it outside React.
export const flyout = new FlyoutStore();

export default class RootStore {
    constructor(core, ws) {
        this.flyout = flyout;
        this.bot = new BotStore();
        this.toolbar = new ToolbarStore(this.flyout);
        this.core = core;
        this.ws = ws;
    }
}
