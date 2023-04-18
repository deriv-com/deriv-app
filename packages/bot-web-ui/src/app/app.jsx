import '../public-path'; // Leave this here (at the top)! OK boss!
import React from 'react'; // eslint-disable-line import/first
import { Loading } from '@deriv/components';
import { DBot, ServerTime, ApiHelpers, setColors } from '@deriv/bot-skeleton'; // eslint-disable-line import/first
import {
    Audio,
    BotFooterExtensions,
    BotNotificationMessages,
    Dashboard,
    NetworkToastPopup,
    RoutePromptDialog,
} from 'Components';
import BlocklyLoading from '../components/blockly-loading';
import { StoreProvider, useStore } from '@deriv/stores';
import { DbotStoreProvider, useDbotStore } from 'Stores/dbotStore';
import RootStore from 'Stores';
import GTM from 'Utils/gtm';
import BotBuilder from 'Components/dashboard/bot-builder';
import './app.scss';

const AppWrapper = ({ passthrough }) => {
    const { root_store, WS } = passthrough;
    const root_store_instance = React.useRef(new RootStore(root_store, WS, DBot));

    return (
        <StoreProvider store={root_store}>
            {/* TODO: only pass the root_store_instance as prop once all the connect method is removed */}
            <DbotStoreProvider store={{ ...root_store_instance.current, ...root_store }}>
                <App root_store_instance={root_store_instance} />
            </DbotStoreProvider>
        </StoreProvider>
    );
};

const App = ({ root_store_instance }) => {
    const [is_loading, setIsLoading] = React.useState(true);
    const {
        common,
        client,
        ui: { is_dark_mode_on },
    } = useStore();
    const {
        app,
        app: { showDigitalOptionsMaltainvestError },
    } = useDbotStore();

    React.useEffect(() => {
        setColors(is_dark_mode_on);
    }, [is_dark_mode_on]);

    React.useEffect(() => {
        /**
         * Inject: External Script Hotjar - for DBot only
         */
        (function (h, o, t, j) {
            /* eslint-disable */
            h.hj =
                h.hj ||
                function () {
                    (h.hj.q = h.hj.q || []).push(arguments);
                };
            /* eslint-enable */
            h._hjSettings = { hjid: 3050531, hjsv: 6 };
            const a = o.getElementsByTagName('head')[0];
            const r = o.createElement('script');
            r.async = 1;
            r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
            a.appendChild(r);
        })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
    }, []);

    React.useEffect(() => {
        showDigitalOptionsMaltainvestError(client, common);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [client.is_options_blocked, client.account_settings.country_code]);

    React.useEffect(() => {
        GTM.init(root_store_instance.current);
        ServerTime.init(common);
        app.setDBotEngineStores(root_store_instance.current);
        ApiHelpers.setInstance(app.api_helpers_store);
        const { active_symbols } = ApiHelpers.instance;
        setIsLoading(true);
        active_symbols.retrieveActiveSymbols(true).then(() => {
            setIsLoading(false);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        const onDisconnectFromNetwork = () => {
            setIsLoading(false);
        };
        window.addEventListener('offline', onDisconnectFromNetwork);
        return () => {
            window.removeEventListener('offline', onDisconnectFromNetwork);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return is_loading ? (
        <Loading />
    ) : (
        <>
            <BlocklyLoading />
            <div className='bot-dashboard bot'>
                <Audio />
                <BotFooterExtensions />
                <BotNotificationMessages />
                <Dashboard />
                <NetworkToastPopup />
                <BotBuilder />
                <RoutePromptDialog />
            </div>
        </>
    );
};

export default AppWrapper;
