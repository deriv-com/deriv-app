import ContractCardStore from './contract-card-store';
import FlyoutStore       from './flyout-store';
import ScratchStore      from './scratch-store';
import SummaryStore      from './summary-store';
import ToolbarStore      from './toolbar-store';

export default class RootStore {
    constructor(core, ws) {
        this.core          = core;
        this.ws            = ws;
        this.flyout        = new FlyoutStore(this);
        this.summary       = new SummaryStore(this);
        this.contract_card = new ContractCardStore(this);
        this.toolbar       = new ToolbarStore(this);

        // Create a singleton class to share rootStore with scratch
        ScratchStore.setInstance(this);
    }
}
