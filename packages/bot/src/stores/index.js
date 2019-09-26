import FlyoutStore   from './flyout-store';
import JournalStore  from './journal-store';
import RunPanelStore from './run-panel-store';
import ScratchStore  from './scratch-store';
import ToolbarStore  from './toolbar-store';

export default class RootStore {
    constructor(core, ws) {
        this.core = core;
        this.ws = ws;
        this.flyout   = new FlyoutStore(this);
        this.runPanel = new RunPanelStore(this);
        this.journal  = new JournalStore(this);
        this.toolbar  = new ToolbarStore(this);

        // Create a singleton class to share rootStore with scratch
        ScratchStore.setInstance(this);
    }
}
