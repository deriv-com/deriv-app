import '../public-path'; // Leave this here (at the top)! OK boss!
import React from 'react'; // eslint-disable-line import/first
import { Loading } from '@deriv/components';
import { ServerTime, ApiHelpers } from '@deriv/bot-skeleton'; // eslint-disable-line import/first
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
import { connect } from 'Stores/connect';
import GTM from 'Utils/gtm';
import './app.scss';

const AppContainer = ({ current_store }) => {
    const [is_loading, setIsLoading] = React.useState(true);
    const { app, common } = current_store;

    React.useEffect(() => {
        if (!common.is_network_online) {
            setIsLoading(false);
        }
    }, [common.is_network_online]);

    const { onMount, onUnmount } = app;
    React.useEffect(() => {
        GTM.init(current_store);
        ServerTime.init(common);
        app.setDBotEngineStores(current_store);

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onMount, onUnmount]);

    return is_loading ? (
        <Loading />
    ) : (
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
    );
};

export default connect(current_store => ({
    current_store,
}))(AppContainer);
