import React from 'react';
import { APIProvider } from '@deriv/api';
import { CashierStore } from '@deriv/cashier';
import { CFDStore } from '@deriv/cfd';
import {
    initFormErrorMessages,
    setSharedCFDText,
    setUrlLanguage,
    setWebsocket,
    useOnLoadTranslation,
} from '@deriv/shared';
import { StoreProvider, ExchangeRatesProvider } from '@deriv/stores';
import { getLanguage, initializeTranslations } from '@deriv/translations';
import WS from 'Services/ws-methods';
import { MobxContentProvider } from 'Stores/connect';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { BrowserRouter as Router } from 'react-router-dom';
import { CFD_TEXT } from '../Constants/cfd-text';
import { FORM_ERROR_MESSAGES } from '../Constants/form-error-messages';
import AppContent from './AppContent';
import 'Sass/app.scss';
import { Analytics } from '@deriv/analytics';
import initHotjar from '../Utils/Hotjar';

const AppWithoutTranslation = ({ root_store }) => {
    const l = window.location;
    const base = l.pathname.split('/')[1];
    const has_base = /^\/(br_)/.test(l.pathname);
    const [is_translation_loaded] = useOnLoadTranslation();
    const initCashierStore = () => {
        root_store.modules.attachModule('cashier', new CashierStore(root_store, WS));
        root_store.modules.cashier.general_store.init();
    };
    // TODO: investigate the order of cashier store initialization
    // eslint-disable-next-line react-hooks/exhaustive-deps
    React.useEffect(initCashierStore, []);
    const initCFDStore = () => {
        root_store.modules.attachModule('cfd', new CFDStore({ root_store, WS }));
    };

    React.useEffect(initCFDStore, []);

    React.useEffect(() => {
        const loadSmartchartsStyles = () => {
            if (root_store.client.is_beta_chart) {
                import('@deriv/deriv-charts-beta/dist/smartcharts.css');
            } else {
                import('@deriv/deriv-charts/dist/smartcharts.css');
            }
        };

        initializeTranslations();
        if (
            process.env.NODE_ENV === 'production' ||
            process.env.NODE_ENV === 'staging' ||
            process.env.NODE_ENV === 'test'
        ) {
            Analytics.initialise({
                growthbookKey: process.env.GROWTHBOOK_CLIENT_KEY,
                growthbookDecryptionKey: process.env.GROWTHBOOK_DECRYPTION_KEY,
                rudderstackKey: process.env.RUDDERSTACK_KEY,
                enableDevMode: process.env.NODE_ENV !== 'production',
            });
        }

        // TODO: [translation-to-shared]: add translation implemnentation in shared
        setUrlLanguage(getLanguage());
        initFormErrorMessages(FORM_ERROR_MESSAGES);
        setSharedCFDText(CFD_TEXT);
        root_store.common.setPlatform();
        loadSmartchartsStyles();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        initHotjar(root_store.client);
    }, []);

    const platform_passthrough = {
        root_store,
        WS,
    };

    setWebsocket(WS);

    return (
        <>
            {is_translation_loaded ? (
                <Router basename={has_base ? `/${base}` : null}>
                    <MobxContentProvider store={root_store}>
                        <APIProvider>
                            <StoreProvider store={root_store}>
                                <ExchangeRatesProvider>
                                    <AppContent passthrough={platform_passthrough} />
                                </ExchangeRatesProvider>
                            </StoreProvider>
                        </APIProvider>
                    </MobxContentProvider>
                </Router>
            ) : (
                <></>
            )}
        </>
    );
};

AppWithoutTranslation.propTypes = {
    root_store: PropTypes.object,
};
const App = withTranslation()(AppWithoutTranslation);

export default App;
