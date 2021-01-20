import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
// Initialize i18n by importing it here
// eslint-disable-next-line no-unused-vars
import debounce from 'lodash.debounce';
import { DesktopWrapper } from '@deriv/components';
import {
    checkAndSetEndpointFromUrl,
    setUrlLanguage,
    isMobile,
    isTouchDevice,
    initFormErrorMessages,
    mobileOSDetect,
    setSharedMT5Text,
} from '@deriv/shared';
import { initializeTranslations, getLanguage, useOnLoadTranslation } from '@deriv/translations';
import { CashierStore } from '@deriv/cashier';
import WS from 'Services/ws-methods';
import { MobxContentProvider } from 'Stores/connect';
import SmartTraderIFrame from 'Modules/SmartTraderIFrame';
import AppToastMessages from './Containers/app-toast-messages.jsx';
import ErrorBoundary from './Components/Elements/Errors/error-boundary.jsx';
import AppContents from './Containers/Layout/app-contents.jsx';
import PlatformContainer from './Containers/PlatformContainer/PlatformContainer.jsx';
import Footer from './Containers/Layout/footer.jsx';
import Header from './Containers/Layout/header';
import AppNotificationMessages from './Containers/app-notification-messages.jsx';
import AppModals from './Containers/Modals';
import Routes from './Containers/Routes/routes.jsx';
import initStore from './app';
import { FORM_ERROR_MESSAGES } from '../Constants/form-error-messages';
import { MT5_TEXT } from '../Constants/mt5-text';

// eslint-disable-next-line import/extensions
// eslint-disable-next-line import/no-unresolved
import 'Sass/app.scss';

const initCashierStore = () => {
    root_store.modules.attachModule('cashier', new CashierStore({ root_store, WS }));
};

const App = ({ root_store }) => {
    const l = window.location;
    const base = l.pathname.split('/')[1];
    const has_base = /^\/(br_)/.test(l.pathname);
    const [is_translation_loaded] = useOnLoadTranslation();
    React.useEffect(initCashierStore, []);
    React.useEffect(() => {
        checkAndSetEndpointFromUrl();
        initializeTranslations();

        // TODO: [translation-to-shared]: add translation implemnentation in shared
        setUrlLanguage(getLanguage());
        initFormErrorMessages(FORM_ERROR_MESSAGES);
        setSharedMT5Text(MT5_TEXT);
    }, []);

    const handleResize = React.useCallback(() => {
        if (isTouchDevice() && isMobile()) {
            const is_android_device = mobileOSDetect() === 'Android';
            const view_width = is_android_device ? screen.availWidth : window.innerWidth;
            const view_height = is_android_device ? screen.availHeight : window.innerHeight;
            const el_landscape_blocker = document.getElementById('landscape_blocker');
            if (view_width <= view_height) {
                root_store.ui.onOrientationChange({ is_landscape_orientation: false });
                el_landscape_blocker.classList.remove('landscape-blocker--visible');
            } else {
                root_store.ui.onOrientationChange({ is_landscape_orientation: true });
                el_landscape_blocker.classList.add('landscape-blocker--visible');
            }
        }
    }, [root_store.ui]);

    React.useEffect(() => {
        const debouncedHandleResize = debounce(handleResize, 400);
        window.addEventListener('resize', debouncedHandleResize);

        return () => {
            window.removeEventListener('resize', debouncedHandleResize);
        };
    }, [handleResize]);

    const platform_passthrough = {
        root_store,
        WS,
    };

    return (
        <>
            {is_translation_loaded ? (
                <Router basename={has_base ? `/${base}` : null}>
                    <MobxContentProvider store={root_store}>
                        <PlatformContainer>
                            <Header />
                            <ErrorBoundary>
                                <AppContents>
                                    {/* TODO: [trader-remove-client-base] */}
                                    <Routes passthrough={platform_passthrough} />
                                </AppContents>
                            </ErrorBoundary>
                            <DesktopWrapper>
                                <Footer />
                            </DesktopWrapper>
                            <AppModals />
                            <SmartTraderIFrame />
                            <AppToastMessages />
                        </PlatformContainer>
                    </MobxContentProvider>
                </Router>
            ) : (
                <></>
            )}
        </>
    );
};

App.propTypes = {
    root_store: PropTypes.object,
};

export default App;

const root_store = initStore(AppNotificationMessages);

const wrapper = document.getElementById('deriv_app');
// eslint-disable-next-line no-unused-expressions
wrapper ? ReactDOM.render(<App root_store={root_store} />, wrapper) : false;
