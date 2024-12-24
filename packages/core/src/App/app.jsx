import React from 'react';
import { useTranslation, withTranslation } from 'react-i18next';
import { BrowserRouter as Router } from 'react-router-dom';
import PropTypes from 'prop-types';

import { APIProvider } from '@deriv/api';
import { CashierStore } from '@deriv/cashier';
import { CFDStore } from '@deriv/cfd';
import { Loading } from '@deriv/components';
import { useGrowthbookGetFeatureValue } from '@deriv/hooks';
import {
    initFormErrorMessages,
    POIProvider,
    setSharedCFDText,
    setUrlLanguage,
    setWebsocket,
    useOnLoadTranslation,
} from '@deriv/shared';
import { P2PSettingsProvider, StoreProvider } from '@deriv/stores';
import { getLanguage, initializeTranslations } from '@deriv/translations';
import { Analytics } from '@deriv-com/analytics';
import { BreakpointProvider } from '@deriv-com/quill-ui';
import { getInitialLanguage, initializeI18n, TranslationProvider } from '@deriv-com/translations';

import WS from 'Services/ws-methods';

import { CFD_TEXT } from '../Constants/cfd-text';
import { FORM_ERROR_MESSAGES } from '../Constants/form-error-messages';

import AppContent from './AppContent';

import 'Sass/app.scss';

const AppWithoutTranslation = ({ root_store }) => {
    const i18nInstance = initializeI18n({
        cdnUrl: `${process.env.CROWDIN_URL}/${process.env.ACC_TRANSLATION_PATH}`, // https://translations.deriv.com/deriv-app-accounts/staging/translations
    });
    const [trigger_login_for_hub_country_list, trigger_login_for_hub_country_list_loaded] =
        useGrowthbookGetFeatureValue({
            featureFlag: 'trigger_login_for_hub_country_list',
        });
    const l = window.location;
    const base = l.pathname.split('/')[1];
    const has_base = /^\/(br_)/.test(l.pathname);
    const [is_translation_loaded] = useOnLoadTranslation();
    const initCashierStore = () => {
        root_store.modules.attachModule('cashier', new CashierStore(root_store, WS));
        root_store.modules.cashier.general_store.init();
    };
    const { i18n } = useTranslation();
    const initCFDStore = () => {
        root_store.modules.attachModule('cfd', new CFDStore({ root_store, WS }));
    };
    const { preferred_language } = root_store.client;
    const { is_dark_mode_on } = root_store.ui;
    const is_dark_mode = is_dark_mode_on || JSON.parse(localStorage.getItem('ui_store'))?.is_dark_mode_on;
    const language = preferred_language ?? getInitialLanguage();

    React.useEffect(() => {
        if (trigger_login_for_hub_country_list_loaded && trigger_login_for_hub_country_list) {
            localStorage.setItem('config.app_id', 61554);
        }
    }, [trigger_login_for_hub_country_list_loaded, trigger_login_for_hub_country_list]);

    React.useEffect(() => {
        const dir = i18n.dir(i18n.language.toLowerCase());
        document.documentElement.dir = dir;
    }, [i18n, i18n.language]);

    React.useEffect(() => {
        initCashierStore();
        initCFDStore();
        const loadSmartchartsStyles = () => {
            import('@deriv/deriv-charts/dist/smartcharts.css');
        };

        initializeTranslations();

        // TODO: [translation-to-shared]: add translation implemnentation in shared
        setUrlLanguage(getLanguage());
        initFormErrorMessages(FORM_ERROR_MESSAGES);
        setSharedCFDText(CFD_TEXT);
        root_store.common.setPlatform();
        loadSmartchartsStyles();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const platform_passthrough = {
        root_store,
        WS,
        i18nInstance,
        language,
    };

    setWebsocket(WS);

    React.useEffect(() => {
        if (!root_store.client.email) {
            Analytics.reset();
        }
    }, [root_store.client.email]);

    React.useEffect(() => {
        const html = document?.querySelector('html');

        if (!html) return;
        if (is_dark_mode) {
            html.classList?.remove('light');
            html.classList?.add('dark');
        } else {
            html.classList?.remove('dark');
            html.classList?.add('light');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {is_translation_loaded ? (
                <Router basename={has_base ? `/${base}` : null}>
                    <StoreProvider store={root_store}>
                        <BreakpointProvider>
                            <APIProvider>
                                <POIProvider>
                                    <P2PSettingsProvider>
                                        <TranslationProvider defaultLang={language} i18nInstance={i18nInstance}>
                                            {/* This is required as translation provider uses suspense to reload language */}
                                            <React.Suspense fallback={<Loading />}>
                                                <AppContent passthrough={platform_passthrough} />
                                            </React.Suspense>
                                        </TranslationProvider>
                                    </P2PSettingsProvider>
                                </POIProvider>
                            </APIProvider>
                        </BreakpointProvider>
                    </StoreProvider>
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
