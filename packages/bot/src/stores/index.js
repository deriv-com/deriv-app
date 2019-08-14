import BotStore from './bot-store';
import ToolbarStore from './toolbar-store';

export default class RootStore {
    constructor(core, ws) {
        this.bot = new BotStore(ws);
        this.toolbar = new ToolbarStore(ws);

        this.core = core;
        this.ws = ws;
    }
}
