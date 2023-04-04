import classNames from 'classnames';
import * as React from 'react';
import { setWebsocket, routes } from '@deriv/shared';
import { StoreProvider, observer } from '@deriv/stores';
import CashierStoreProvider from '@deriv/cashier/src/cashier-providers';
import Routes from 'Components/routes/routes';
import { useStores, initContext } from 'Stores';
import { TRootStore } from 'Types';
import './app.scss';
import { datadogRum } from '@datadog/browser-rum';

type TAppProps = {
    passthrough: {
        root_store: TRootStore;
        WS: Record<string, any>;
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

const App = ({ passthrough: { WS, root_store } }: TAppProps) => {
    initContext(root_store, WS);
    setWebsocket(WS);
    const { ui }: TRootStore = useStores();

    return (
        <CashierStoreProvider store={root_store as any}>
            <StoreProvider store={root_store as any}>
                <main
                    className={classNames('dashboard', {
                        'theme--light': !ui.is_dark_mode_on,
                        'theme--dark': ui.is_dark_mode_on,
                        'dashboard-onboarding': window.location.pathname === routes.onboarding,
                    })}
                >
                    <div className='dw-dashboard'>
                        <Routes />
                    </div>
                </main>
            </StoreProvider>
        </CashierStoreProvider>
    );
};

export default observer(App);
