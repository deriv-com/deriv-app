import BotStore from './bot-store';

export default class RootStore {
    constructor(core, ws) {
        this.bot = new BotStore(ws);
        this.core = core;
        this.ws = ws;
    }
}
