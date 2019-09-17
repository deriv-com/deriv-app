import FlyoutStore  from './flyout-store';
import ScratchStore from './scratch-store';

export default class RootStore {
    constructor(core, ws) {
        this.core = core;
        this.ws = ws;
        this.flyout = new FlyoutStore();

        // Create a singleton class to share rootStore with scratch
        ScratchStore.setInstance(this);
    }
}
