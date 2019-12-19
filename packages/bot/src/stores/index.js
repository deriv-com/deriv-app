import ChartStore         from 'Stores/chart-store';
import ContractCardStore  from 'Stores/contract-card-store';
import FlyoutStore        from 'Stores/flyout-store';
import FlyoutHelpStore    from 'Stores/flyout-help-store';
import GoogleDriveStore   from 'Stores/google-drive-store';
import JournalStore       from 'Stores/journal-store';
import RunPanelStore      from 'Stores/run-panel-store';
import SaveLoadModalStore from 'Stores/saveload-modal-store';
import ScratchStore       from 'Stores/scratch-store';
import SummaryStore       from 'Stores/summary-store';
import ToolbarStore       from 'Stores/toolbar-store';
import TransactionsStore  from 'Stores/transactions-store';
import QuickStrategyStore from 'Stores/quick-strategy-store';
import MainContentStore   from 'Stores/main-content-store';

export default class RootStore {
    constructor(core, ws) {
        this.core             = core;
        this.ui               = core.ui;
        this.common           = core.common;
        this.ws               = ws;
        this.contract_card    = new ContractCardStore(this);
        this.flyout           = new FlyoutStore(this);
        this.flyout_help      = new FlyoutHelpStore(this);
        this.google_drive     = new GoogleDriveStore(this);
        this.journal          = new JournalStore(this);
        this.saveload         = new SaveLoadModalStore(this);
        this.summary          = new SummaryStore(this);
        this.transactions     = new TransactionsStore(this);
        this.toolbar          = new ToolbarStore(this);
        this.quick_strategy   = new QuickStrategyStore(this);
        this.run_panel        = new RunPanelStore(this);
        this.chart_store      = new ChartStore(this);
        this.main_content     = new MainContentStore(this);

        // Create a singleton class to share root_store with scratch
        ScratchStore.setInstance(this);
    }
}
