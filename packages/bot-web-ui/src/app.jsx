import { 
    DBot,
    ServerTime }            from 'deriv-bot-engine';
import { reaction }         from 'mobx';
import { Provider }         from 'mobx-react';
import React                from 'react';
import                           './public-path'; // Leave this here! OK boss!
import FooterExtension      from './components/footer-extension.jsx';
import MainContent          from './components/main-content.jsx';
import NotificationMessages from './components/notification-messages.jsx';
import QuickStrategy        from './components/quick-strategy.jsx';
import RunPanel             from './components/run-panel.jsx';
import Toolbar              from './components/toolbar.jsx';
import RootStore            from './stores';
import GTM                  from './utils/gtm';
import                      './assets/sass/app.scss';

class App extends React.Component {
    constructor(props) {
        super(props);
        const { passthrough: { WS, root_store } } = props;
        this.root_store = new RootStore(root_store, WS, DBot);

        GTM.init(this.root_store);
        ServerTime.init(root_store.common);
        
        const { flyout, toolbar, quick_strategy } = this.root_store;
        // dont pass the rootstore in, if you need a prop define it in dbot-engine-store ans pass it through
        this.dbot_store = { is_mobile: false, flyout, toolbar, quick_strategy };
        this.api_helper_store = { ws: this.root_store.ws, server_time : this.root_store.server_time}
    }

    componentDidMount() {

        DBot.initWorkspace(__webpack_public_path__, this.dbot_store, this.api_helper_store);
        this.registerOnAccountSwitch();
    }

    componentWillUnmount() {
        if (Blockly.derivWorkspace) {
            Blockly.derivWorkspace.dispose();
        }

        this.disposeReactions();
        this.disposeOnAccountSwitch();
    }

    /**
    * Register a reaction to currency
    */
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

    /**
    * Dispose the reaction that has been added to currency broadcast
    */
    disposeReactions() {
        if (typeof this.disposeCurrencyReaction === 'function') {
            this.disposeCurrencyReaction();
        }
    }

    /**
    * Register a reaction to switchaccount
    */
    registerOnAccountSwitch = () => {
        const { client } = this.root_store.core;

        this.disposeSwitchAccountListener = reaction(
            () => client.switch_broadcast,
            (switch_broadcast) => {
                if (!switch_broadcast) {
                    return;
                }

                const { derivWorkspace: workspace } = Blockly;

                if (workspace) {
                    this.active_symbols.retrieveActiveSymbols(true).then(() => {
                        this.contracts_for.disposeCache();
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

    /**
    * Dispose the reaction that has been added to switchaccount broadcast
    */
    disposeOnAccountSwitch() {
        if (typeof this.disposeSwitchAccountListener === 'function') {
            this.disposeSwitchAccountListener();
        }
    }

    render() {
        return (
            <Provider {...this.root_store}>
                <div className='bot'>
                    <NotificationMessages />
                    <Toolbar />
                    <MainContent />
                    <RunPanel />
                    <QuickStrategy />
                    <FooterExtension />
                </div>
            </Provider>
        );
    }
}
export default App;
