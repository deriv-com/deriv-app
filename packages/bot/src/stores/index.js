import FlyoutStore   from './flyout-store';
import GoogleDriveStore     from './google-drive-store';
import JournalStore  from './journal-store';
import RunPanelStore from './run-panel-store';
import SaveLoadModalStore   from './saveload-modal-store';
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
        this.google_drive = new GoogleDriveStore(this);
        this.saveload = new SaveLoadModalStore(this);

        // Create a singleton class to share rootStore with scratch
        ScratchStore.setInstance(this);
    }
}
