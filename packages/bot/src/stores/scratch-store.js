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

    registerReactions() {
        // Syncs all trade options blocks' currency with the client's active currency.
        this.disposeCurrencyReaction = reaction(
            () => this.root_store.core.client.currency,
            () => {
                const workspace = Blockly.derivWorkspace;

                if (!workspace) {
                    return;
                }

                const trade_options_blocks = workspace.getAllBlocks().filter(b => b.type === 'trade_definition_tradeoptions');

                if (!trade_options_blocks.length) {
                    return;
                }

                trade_options_blocks.forEach(block => block.setCurrency());
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
