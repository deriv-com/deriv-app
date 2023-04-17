import React from 'react'; // eslint-disable-line import/first
import { ApiHelpers, DBot, ServerTime, setColors } from '@deriv/bot-skeleton'; // eslint-disable-line import/first
import { Loading } from '@deriv/components';
import {
    Audio,
    BotFooterExtensions,
    BotNotificationMessages,
    Dashboard,
    NetworkToastPopup,
    RoutePromptDialog,
} from 'Components';
import BotBuilder from 'Components/dashboard/bot-builder';
import GTM from 'Utils/gtm';
import RootStore from 'Stores';
import { MobxContentProvider } from 'Stores/connect';
import BlocklyLoading from '../components/blockly-loading';
import './app.scss';
import '../public-path'; // Leave this here (at the top)! OK boss!

const App = ({ passthrough }) => {
    const { root_store, WS } = passthrough;
    const [is_loading, setIsLoading] = React.useState(true);
    const root_store_instance = React.useRef(new RootStore(root_store, WS, DBot));
    const { app, common, core } = root_store_instance.current;
    const { showDigitalOptionsMaltainvestError } = app;
    const {
        ui: { is_dark_mode_on },
    } = root_store_instance.current;

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
        showDigitalOptionsMaltainvestError(core.client, common);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [core.client.is_options_blocked, core.client.account_settings.country_code]);

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
        <MobxContentProvider store={root_store_instance.current}>
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
        </MobxContentProvider>
    );
};

export default App;
