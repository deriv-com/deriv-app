import FlyoutStore from './flyout-store';

export default class RootStore {
    constructor(core, ws) {
        this.core = core;
        this.ws = ws;
        this.flyout = new FlyoutStore();
    }
}
