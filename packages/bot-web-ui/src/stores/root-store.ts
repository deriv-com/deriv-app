import AppStore from './app-store';
import BlocklyStore from './blockly-store';
import ChartStore from './chart-store';
import DashboardStore from './dashboard-store';
import DataCollectionStore from './data-collection-store';
import DownloadStore from './download-store';
import FlyoutHelpStore from './flyout-help-store';
import FlyoutStore from './flyout-store';
import GoogleDriveStore from './google-drive-store';
import JournalStore from './journal-store';
import LoadModalStore from './load-modal-store';
import QuickStrategyStore from './quick-strategy-store';
import RoutePromptDialogStore from './route-prompt-dialog-store';
import RunPanelStore from './run-panel-store';
import SaveModalStore from './save-modal-store';
import SelfExclusionStore from './self-exclusion-store';
import SummaryCardStore from './summary-card-store';
import SummaryStore from './summary-store';
import ToolbarStore from './toolbar-store';
import ToolboxStore from './toolbox-store';
import TransactionsStore from './transactions-store';

// TODO: need to write types for the root store
export default class RootStore {
    constructor(core, ws, dbot) {
        this.core = core;
        this.ui = core.ui;
        this.common = core.common;
        this.notifications = core.notifications;
        this.ws = ws;
        this.dbot = dbot;
        this.server_time = core.common.server_time;
        this.app = new AppStore(this);
        this.summary_card = new SummaryCardStore(this);
        this.download = new DownloadStore(this);
        this.flyout = new FlyoutStore(this);
        this.flyout_help = new FlyoutHelpStore(this);
        this.google_drive = new GoogleDriveStore(this);
        this.journal = new JournalStore(this);
        this.load_modal = new LoadModalStore(this);
        this.run_panel = new RunPanelStore(this);
        this.save_modal = new SaveModalStore(this);
        this.summary = new SummaryStore(this);
        this.transactions = new TransactionsStore(this);
        this.toolbar = new ToolbarStore(this);
        this.toolbox = new ToolboxStore(this);
        this.quick_strategy = new QuickStrategyStore(this);
        this.route_prompt_dialog = new RoutePromptDialogStore(this);
        this.self_exclusion = new SelfExclusionStore(this);
        this.dashboard = new DashboardStore(this);

        // need to be at last for dependency
        this.chart_store = new ChartStore(this);
        this.blockly_store = new BlocklyStore(this);
        this.data_collection_store = new DataCollectionStore(this);
    }
}
