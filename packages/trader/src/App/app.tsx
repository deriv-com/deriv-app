import PropTypes from 'prop-types';
import React from 'react';
import Loadable from 'react-loadable';
import Routes from 'App/Containers/Routes/routes.jsx';
import TradeHeaderExtensions from 'App/Containers/trade-header-extensions.jsx';
import TradeFooterExtensions from 'App/Containers/trade-footer-extensions.jsx';
import TradeSettingsExtensions from 'App/Containers/trade-settings-extensions.jsx';
import { NetworkStatusToastErrorPopup } from 'Modules/Trading/Containers/toast-popup.jsx';
import { MobxContentProvider } from 'Stores/connect';
import initStore from './init-store.js'; // eslint-disable-line import/extensions
import 'Sass/app.scss';
import { datadogRum } from '@datadog/browser-rum';

type Apptypes = {
    passthrough: {
        root_store: any;
        WS: any;
    };
};

const DATADOG_APP_ID = process.env.DATADOG_APPLICATION_ID ? process.env.DATADOG_APPLICATION_ID : '';
const DATADOG_CLIENT_TOKEN = process.env.DATADOG_CLIENT_TOKEN ? process.env.DATADOG_CLIENT_TOKEN : '';

datadogRum.init({
    applicationId: DATADOG_APP_ID,
    clientToken: DATADOG_CLIENT_TOKEN,
    site: 'datadoghq.com',
    service: 'deriv.com-static-site',
    env: 'qa',
    // Specify a version number to identify the deployed version of your application in Datadog
    // version: '1.0.0',
    sessionSampleRate: 100,
    sessionReplaySampleRate: 20,
    trackUserInteractions: true,
    trackResources: true,
    trackLongTasks: true,
    defaultPrivacyLevel: 'mask-user-input',
});

const TradeModals = Loadable({
    loader: () => import(/* webpackChunkName: "trade-modals", webpackPrefetch: true */ './Containers/Modals'),
    loading: () => null,
});

const App = ({ passthrough }: Apptypes) => {
    const [root_store] = React.useState(initStore(passthrough.root_store, passthrough.WS));
    React.useEffect(() => {
        return () => root_store.ui.setPromptHandler(false);
    }, [root_store]);

    return (
        <MobxContentProvider store={root_store}>
            <React.Fragment>
                <Routes />
                <TradeModals />
                <NetworkStatusToastErrorPopup />
                <TradeHeaderExtensions store={root_store} />
                <TradeFooterExtensions />
                <TradeSettingsExtensions store={root_store} />
            </React.Fragment>
        </MobxContentProvider>
    );
};

App.propTypes = {
    passthrough: PropTypes.shape({
        root_store: PropTypes.object,
        WS: PropTypes.object,
    }),
};

export default App;
