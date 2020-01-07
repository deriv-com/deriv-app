import { reaction } from 'mobx';

class ScratchStore {
    static singleton = null;

    constructor(root_store) {
        this.root_store = root_store;
        this.flyout     = root_store.flyout;
        this.toolbar    = root_store.toolbar;
        this.saveload   = root_store.saveload;
        this.quick_strategy = root_store.quick_strategy;
        this.registerReactions();
    }

    static setInstance(root_store) {
        if (!this.singleton) {
            this.singleton = new ScratchStore(root_store);
        }

        return this.instance;
    }

    static get instance() {
        return this.singleton;
    }

    /// move this to main-content jsx
    registerReactions() {
        // Syncs all trade options blocks' currency with the client's active currency.
        this.disposeCurrencyReaction = reaction(
            () => this.root_store.core.client.currency,
            (currency) => {
                const workspace = Blockly.derivWorkspace;

                if (workspace) {
                    const trade_options_blocks = workspace.getAllBlocks().filter(b => b.type === 'trade_definition_tradeoptions');
                    trade_options_blocks.forEach(trade_options_block => trade_options_block.setCurrency(currency));
                }
            },
        );
    }

    disposeReactions() {
        if (typeof this.disposeCurrencyReaction === 'function') {
            this.disposeCurrencyReaction();
        }
    }
}

export default ScratchStore;
