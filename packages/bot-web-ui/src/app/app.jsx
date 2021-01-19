import '../public-path'; // Leave this here (at the top)! OK boss!
import React from 'react'; // eslint-disable-line import/first
import { Loading } from '@deriv/components';
import { DBot, ServerTime, ApiHelpers } from '@deriv/bot-skeleton'; // eslint-disable-line import/first
import {
    Audio,
    BlocklyLoading,
    BotFooterExtensions,
    BotNotificationMessages,
    MainContent,
    QuickStrategy,
    RunPanel,
    RoutePromptDialog,
    Toolbar,
} from 'Components';
import { MobxContentProvider } from 'Stores/connect';
import RootStore from 'Stores';
import GTM from 'Utils/gtm';

class App extends React.Component {
    constructor(props) {
        super(props);

        const { root_store, WS } = props.passthrough;
        this.root_store = new RootStore(root_store, WS, DBot);

        GTM.init(this.root_store);
        ServerTime.init(this.root_store.common);
        this.root_store.app.setDBotEngineStores(this.root_store);

        this.state = {
            is_loading: true,
        };
    }

    componentDidMount() {
        ApiHelpers.setInstance(this.root_store.app.api_helpers_store);
        const { active_symbols } = ApiHelpers.instance;

        this.setState({ is_loading: true });
        active_symbols.retrieveActiveSymbols(true).then(() => {
            this.setState({ is_loading: false });
            this.root_store.app.onMount();
        });
    }

    componentWillUnmount() {
        this.root_store.app.onUnmount();
    }

    render() {
        if (this.state.is_loading) {
            return <Loading />;
        }
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
