import './public-path'; // Leave this here (at the top)! OK boss!
import React from 'react'; // eslint-disable-line import/first
import { Loading } from '@deriv/components';
import { DBot, ServerTime, ApiHelpers } from '@deriv/bot-skeleton'; // eslint-disable-line import/first
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

const App = ({ passthrough }) => {
    const { root_store, WS } = passthrough;
    const [is_loading, setIsLoading] = React.useState(true);
    const root_store_instance = React.useRef(new RootStore(root_store, WS, DBot));

    const { app, common } = root_store_instance.current;

    React.useEffect(() => {
        GTM.init(root_store_instance.current);
        ServerTime.init(common);
    }, [root_store_instance.current]);

    app.setDBotEngineStores(root_store_instance.current);

    const { onMount, onUnmount } = app;
    React.useEffect(() => {
        ApiHelpers.setInstance(app.api_helpers_store);
        const { active_symbols } = ApiHelpers.instance;

        setIsLoading(true);
        active_symbols.retrieveActiveSymbols(true).then(() => {
            setIsLoading(false);
            onMount();
        });

        return () => {
            onUnmount();
        };
    }, [onMount, onUnmount]);

    if (is_loading) {
        return <Loading />;
    }
    return (
        <MobxContentProvider store={root_store_instance.current}>
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
};

export default App;
