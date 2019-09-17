import FlyoutStore  from './flyout-store';
import ScratchStore from './scratch-store';
import ToolbarStore from './toolbar-store';

export default class RootStore {
    constructor(core, ws) {
        this.core = core;
        this.ws = ws;
        this.flyout = new FlyoutStore();
        this.toolbar = new ToolbarStore(this.flyout);

        // Create a singleton class to share rootStore with scratch
        ScratchStore.setInstance(this);
    }
}
