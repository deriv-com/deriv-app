import { reaction } from 'mobx';
import React from 'react';
import { showDigitalOptionsUnavailableError } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { runIrreversibleEvents, ApiHelpers, DBot, ServerTime } from '@deriv/bot-skeleton';
import './public-path'; // Leave this here! OK boss!
import Audio from './components/audio.jsx';
import BotFooterExtensions from './components/bot-footer-extensions.jsx';
import MainContent from './components/main-content.jsx';
import BotNotificationMessages from './components/bot-notification-messages.jsx';
import QuickStrategy from './components/quick-strategy.jsx';
import RunPanel from './components/run-panel.jsx';
import Toolbar from './components/toolbar.jsx';
import { MobxContentProvider } from './stores/connect';
import RoutePromptDialog from './components/route-prompt-dialog.jsx';
import BlocklyLoading from './components/blockly-loading.jsx';
import RootStore from './stores';
import GTM from './utils/gtm';
import './assets/sass/app.scss';

const showDigitalOptionsMaltainvestError = (client, common) => {
    if (client.landing_company_shortcode === 'maltainvest') {
        showDigitalOptionsUnavailableError(common.showError, {
            text: localize(
                'We’re working to have this available for you soon. If you have another account, switch to that account to continue trading. You may add a DMT5 Financial.'
            ),
            title: localize('DBot is not available for this account'),
            link: localize('Go to DMT5 dashboard'),
        });
    } else if (common.has_error) common.setError(false, null);
};

class App extends React.Component {
    constructor(props) {
        super(props);
        const {
            passthrough: { WS, root_store },
        } = props;
        this.root_store = new RootStore(root_store, WS, DBot);

        GTM.init(this.root_store);
        ServerTime.init(root_store.common);
        this.setDBotEngineStores();
    }

    setDBotEngineStores() {
        // DO NOT pass the rootstore in, if you need a prop define it in dbot-skeleton-store ans pass it through.
        const {
            core: { client },
            flyout,
            toolbar,
            save_modal,
            quick_strategy,
            load_modal,
            blockly_store,
        } = this.root_store;
        const { handleFileChange } = load_modal;
        const { toggleStrategyModal } = quick_strategy;
        const { startLoading, endLoading } = blockly_store;
        this.dbot_store = {
            is_mobile: false,
            client,
            flyout,
            toolbar,
            save_modal,
            startLoading,
            endLoading,
            toggleStrategyModal,
            handleFileChange,
        };
        this.api_helpers_store = { ws: this.root_store.ws, server_time: this.root_store.server_time };
    }

    componentDidMount() {
        const { client, common } = this.root_store.core;
        showDigitalOptionsMaltainvestError(client, common);
        this.root_store.blockly_store.startLoading();
        DBot.initWorkspace(
            __webpack_public_path__,
            this.dbot_store,
            this.api_helpers_store,
            this.root_store.ui.is_mobile
        ).then(() => this.root_store.blockly_store.endLoading());
        this.registerCurrencyReaction();
        this.registerOnAccountSwitch();
        this.registerClickOutsideBlockly();
        this.registerBeforeUnload();
        this.root_store.main_content.getCachedActiveTab();
        this.turnThemeToLight();
    }

    componentDidUpdate() {
        const { client, common } = this.root_store.core;
        if (client.landing_company_shortcode === 'maltainvest') {
            showDigitalOptionsUnavailableError(common.showError, {
                text: localize(
                    'We’re working to have this available for you soon. If you have another account, switch to that account to continue trading. You may add a DMT5 Financial.'
                ),
                title: localize('DBot is not available for this account'),
                link: localize('Go to DMT5 dashboard'),
            });
        }
    }
    // TODO: [disable-dark-theme] Delete this when Bot is ready for dark theme.
    turnThemeToLight = () => {
        document.body.classList.remove('theme--dark');
        document.body.classList.add('theme--light');
    };

    componentWillUnmount() {
        if (Blockly.derivWorkspace) {
            Blockly.derivWorkspace.dispose();
        }

        this.disposeReactions();
        DBot.terminateBot();

        // Ensure account switch is re-enabled.
        const { ui } = this.root_store.core;
        ui.setAccountSwitcherDisabledMessage(false);
        ui.setPromptHandler(false);
    }

    /**
     * Register a reaction to currency
     */
    registerCurrencyReaction() {
        // Syncs all trade options blocks' currency with the client's active currency.
        this.disposeCurrencyReaction = reaction(
            () => this.root_store.core.client.currency,
            currency => {
                const workspace = Blockly.derivWorkspace;

                if (workspace) {
                    const trade_options_blocks = workspace
                        .getAllBlocks()
                        .filter(b => b.type === 'trade_definition_tradeoptions');
                    trade_options_blocks.forEach(trade_options_block => trade_options_block.setCurrency(currency));
                }
            }
        );
    }

    /**
     * Register a reaction to switchaccount
     */
    registerOnAccountSwitch = () => {
        const { client, common } = this.root_store.core;

        this.disposeSwitchAccountListener = reaction(
            () => client.switch_broadcast,
            switch_broadcast => {
                if (!switch_broadcast) {
                    return;
                }
                showDigitalOptionsMaltainvestError(client, common);
                const { derivWorkspace: workspace } = Blockly;
                const { active_symbols, contracts_for } = ApiHelpers.instance;

                if (workspace) {
                    active_symbols.retrieveActiveSymbols(true).then(() => {
                        contracts_for.disposeCache();
                        workspace
                            .getAllBlocks()
                            .filter(block => block.type === 'trade_definition_market')
                            .forEach(block => {
                                runIrreversibleEvents(() => {
                                    const fake_create_event = new Blockly.Events.Create(block);
                                    Blockly.Events.fire(fake_create_event);
                                });
                            });
                    });
                }
            }
        );
    };

    /**
     * Ensures inputs are closed when clicking on non-Blockly elements.
     */
    onClickOutsideBlockly = event => {
        const path = event.path || (event.composedPath && event.composedPath());
        const is_click_outside_blockly = !path.some(el => el.classList && el.classList.contains('injectionDiv'));
        if (is_click_outside_blockly) {
            Blockly.hideChaff(/* allowToolbox */ false);
        }
    };

    registerClickOutsideBlockly() {
        window.addEventListener('click', this.onClickOutsideBlockly);
    }

    onBeforeUnload = event => {
        if (this.root_store.run_panel.is_stop_button_visible) {
            event.returnValue = true;
        }
    };

    registerBeforeUnload() {
        window.addEventListener('beforeunload', this.onBeforeUnload);
    }

    /**
     * Dispose Mobx reactions & event listeners.
     */
    disposeReactions() {
        if (typeof this.disposeCurrencyReaction === 'function') {
            this.disposeCurrencyReaction();
        }
        if (typeof this.disposeSwitchAccountListener === 'function') {
            this.disposeSwitchAccountListener();
        }
        window.removeEventListener('click', this.onClickOutsideBlockly);
        window.removeEventListener('beforeunload', this.onBeforeUnload);
    }

    render() {
        return (
            <MobxContentProvider store={this.root_store}>
                <div className='bot'>
                    <BotNotificationMessages />
                    <Toolbar />
                    <MainContent />
                    <RunPanel />
                    <QuickStrategy />
                    <BotFooterExtensions />
                    <Audio />
                    <RoutePromptDialog />
                    <BlocklyLoading />
                </div>
            </MobxContentProvider>
        );
    }
}
export default App;
