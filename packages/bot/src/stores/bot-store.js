import { action, reaction } from 'mobx';
import ApiHelpers           from '../services/api/helpers';

export default class BotStore {
    constructor(root_store) {
        this.root_store = root_store;
    }

    @action.bound
    registerAccountSwitcherListener() {
        const { client } = this.root_store.core;
        const { active_symbols, contracts_for } = ApiHelpers.instance;

        this.switchAccountDisposer = reaction(
            () => client.switch_broadcast,
            (switch_broadcast) => {
                if (!switch_broadcast) {
                    return;
                }

                const { derivWorkspace: workspace } = Blockly;

                if (workspace) {
                    active_symbols.retrieveActiveSymbols(true).then(() => {
                        contracts_for.disposeCache();
                        workspace.getAllBlocks()
                            .filter(block => block.type === 'trade_definition_market')
                            .forEach(block => {
                                const fake_create_event = new Blockly.Events.Create(block);
                                Blockly.Events.fire(fake_create_event);
                            });
                    });
                }
            }
        );
    }

    @action.bound
    disposeSwitchAccount() {
        if (typeof this.switchAccountDisposer === 'function') {
            this.switchAccountDisposer();
        }
    }

    @action.bound
    onMount() {
        this.registerAccountSwitcherListener();
    }

    @action.bound
    onUnmount() {
        this.disposeSwitchAccount();
    }
}
