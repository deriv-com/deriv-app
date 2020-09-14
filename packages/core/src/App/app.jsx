import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
// Initialize i18n by importing it here
// eslint-disable-next-line no-unused-vars
import { DesktopWrapper } from '@deriv/components';
import {
    checkAndSetEndpointFromUrl,
    setUrlLanguage,
    isMobile,
    initFormErrorMessages,
    setSharedMT5Text,
} from '@deriv/shared';
import { initializeTranslations, getLanguage } from '@deriv/translations';
import WS from 'Services/ws-methods';
import { MobxContentProvider } from 'Stores/connect';
import SmartTraderIFrame from 'Modules/SmartTraderIFrame';
import AppToastMessages from './Containers/app-toast-messages.jsx';
import ErrorBoundary from './Components/Elements/Errors/error-boundary.jsx';
import AppContents from './Containers/Layout/app-contents.jsx';
import PlatformContainer from './Containers/PlatformContainer/PlatformContainer.jsx';
import Footer from './Containers/Layout/footer.jsx';
import Header from './Containers/Layout/header.jsx';
import AppNotificationMessages from './Containers/app-notification-messages.jsx';
import AppModals from './Containers/Modals';
import Routes from './Containers/Routes/routes.jsx';
import initStore from './app';
import { FORM_ERROR_MESSAGES } from '../Constants/form-error-messages';
import { MT5_TEXT } from '../Constants/mt5-text';

// eslint-disable-next-line import/extensions
// eslint-disable-next-line import/no-unresolved
import 'Sass/app.scss';

const App = ({ root_store }) => {
    const l = window.location;
    const base = l.pathname.split('/')[1];
    const has_base = /^\/(br_)/.test(l.pathname);
    const url_params = new URLSearchParams(l.search);
    React.useEffect(() => {
        checkAndSetEndpointFromUrl();
        initializeTranslations();

        // TODO: [translation-to-shared]: add translation implemnentation in shared
        setUrlLanguage(getLanguage());
        initFormErrorMessages(FORM_ERROR_MESSAGES);
        setSharedMT5Text(MT5_TEXT);
    }, []);

    React.useEffect(() => {
        if (isMobile()) {
            const el_landscape_blocker = document.getElementById('landscape_blocker');

            const onFocus = () => {
                /* Prevent from showing Landscape blocker UI when keyboard is visible */
                el_landscape_blocker.classList.add('landscape-blocker--keyboard-visible');
                root_store.ui.setIsNativepickerVisible(true);
            };

            const onFocusOut = e => {
                if (e.target.classList.contains('dc-dropdown__display')) {
                    // if the next target is a dropdown, keep native picker open
                    return;
                }
                root_store.ui.setIsNativepickerVisible(false);
            };

            const onTouchStart = () => {
                if (document.activeElement.tagName !== 'INPUT') {
                    el_landscape_blocker.classList.remove('landscape-blocker--keyboard-visible');
                }
            };
            /**
             * Adding `focus` and `focusout` event listeners to document here to detect for on-screen keyboard on mobile browsers
             * and storing this value in UI-store to be used across the app stores.
             *  - when document gets `focus` event - keyboard is visible
             *  - when document gets `focusout` or `touchstart` event - keyboard is hidden
             *  - note: the `touchstart` event comes after `focusout` and and we want to
             *          remove `landscape-blocker--keyboard-visible` class as late as possible
             * [TODO]: find an alternative solution to detect for on-screen keyboard
             */
            document.addEventListener('focus', onFocus, true);
            document.addEventListener('focusout', onFocusOut, false);
            document.addEventListener('touchstart', onTouchStart, true);

            return () => {
                document.removeEventListener('focus', onFocus);
                document.removeEventListener('focusout', onFocusOut);
                document.removeEventListener('touchstart', onTouchStart);
            };
        }
        return () => {};
    }, [root_store.ui]);

    const platform_passthrough = {
        root_store,
        WS,
    };

    return (
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
                    <AppModals url_action_param={url_params.get('action')} />
                    <SmartTraderIFrame />
                    <AppToastMessages />
                </PlatformContainer>
            </MobxContentProvider>
        </Router>
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
