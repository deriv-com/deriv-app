import FlyoutStore       from './flyout-store';
import ScratchStore      from './scratch-store';
import SummaryStore      from './summary-store';
import ContractCardStore from './contract-card-store';

export default class RootStore {
    constructor(core, ws) {
        this.core          = core;
        this.ws            = ws;
        this.flyout        = new FlyoutStore(this);
        this.summary       = new SummaryStore(this);
        this.contract_card = new ContractCardStore(this);

        // Create a singleton class to share rootStore with scratch
        ScratchStore.setInstance(this);
    }
}
