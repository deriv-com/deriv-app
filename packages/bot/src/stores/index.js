import ContractCardStore from './contract-card-store';
import FlyoutStore       from './flyout-store';
import JournalStore      from './journal-store';
import RunPanelStore     from './run-panel-store';
import ScratchStore      from './scratch-store';
import SummaryStore      from './summary-store';
import ToolbarStore      from './toolbar-store';
import TransactionsStore from './transactions-store';

export default class RootStore {
    constructor(core, ws) {
        this.core = core;
        this.ws = ws;
        this.contract_card = new ContractCardStore(this);
        this.flyout        = new FlyoutStore(this);
        this.journal       = new JournalStore(this);
        this.run_panel     = new RunPanelStore(this);
        this.summary       = new SummaryStore(this);
        this.transactions  = new TransactionsStore(this);
        this.toolbar       = new ToolbarStore(this);

        // Create a singleton class to share rootStore with scratch
        ScratchStore.setInstance(this);
    }
}
