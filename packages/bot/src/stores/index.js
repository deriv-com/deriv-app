import ContractCardStore from './contract-card-store';
import FlyoutStore   from './flyout-store';
import GoogleDriveStore     from './google-drive-store';
import JournalStore  from './journal-store';
import RunPanelStore from './run-panel-store';
import SaveLoadModalStore   from './saveload-modal-store';
import ScratchStore  from './scratch-store';
import SummaryStore      from './summary-store';
import ToolbarStore  from './toolbar-store';

export default class RootStore {
    constructor(core, ws) {
        this.core = core;
        this.ws = ws;
        this.contract_card  = new ContractCardStore(this);
        this.flyout         = new FlyoutStore(this);
        this.google_drive   = new GoogleDriveStore(this);
        this.journal        = new JournalStore(this);
        this.run_panel      = new RunPanelStore(this);
        this.saveload       = new SaveLoadModalStore(this);
        this.summary        = new SummaryStore(this);
        this.toolbar        = new ToolbarStore(this);

        // Create a singleton class to share rootStore with scratch
        ScratchStore.setInstance(this);
    }
}
