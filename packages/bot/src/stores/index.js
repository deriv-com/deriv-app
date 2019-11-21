import ContractCardStore  from './contract-card-store';
import FlyoutStore        from './flyout-store';
import FlyoutHelpStore    from './flyout-help-store';
import GoogleDriveStore   from './google-drive-store';
import JournalStore       from './journal-store';
import RunPanelStore      from './run-panel-store';
import SaveLoadModalStore from './saveload-modal-store';
import ScratchStore       from './scratch-store';
import SummaryStore       from './summary-store';
import ToolbarStore       from './toolbar-store';
import TransactionsStore  from './transactions-store';
import QuickStrategyStore from './quick-strategy-store';

export default class RootStore {
    constructor(core, ws) {
        this.core  = core;
        this.ws    = ws;
        this.contract_card  = new ContractCardStore(this);
        this.flyout         = new FlyoutStore(this);
        this.flyout_help    = new FlyoutHelpStore(this);
        this.google_drive   = new GoogleDriveStore(this);
        this.journal        = new JournalStore(this);
        this.saveload       = new SaveLoadModalStore(this);
        this.summary        = new SummaryStore(this);
        this.transactions   = new TransactionsStore(this);
        this.toolbar        = new ToolbarStore(this);
        this.quick_strategy = new QuickStrategyStore(this);
        this.run_panel      = new RunPanelStore(this);

        // Create a singleton class to share root_store with scratch
        ScratchStore.setInstance(this);
    }
}
