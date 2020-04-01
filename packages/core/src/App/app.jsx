import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { Prompt } from 'react-router';
import { BrowserRouter as Router } from 'react-router-dom';
// Initialize i18n by importing it here
// eslint-disable-next-line no-unused-vars
import { DesktopWrapper } from '@deriv/components';
import { isMobile } from '@deriv/shared/utils/screen';
import { initializeTranslations } from '@deriv/translations';
import Client from '_common/base/client_base';
import WS from 'Services/ws-methods';
import { MobxProvider } from 'Stores/connect';
import SmartTraderIFrame from 'Modules/SmartTraderIFrame';
import ErrorBoundary from './Components/Elements/Errors/error-boundary.jsx';
import AppContents from './Containers/Layout/app-contents.jsx';
import Footer from './Containers/Layout/footer.jsx';
import Header from './Containers/Layout/header.jsx';
import NotificationMessages from './Containers/notification-messages.jsx';
import AppModals from './Containers/Modals';
import Routes from './Containers/Routes/routes.jsx';
import { interceptAcrossBot } from './Constants/routes-config';
// eslint-disable-next-line import/extensions
import initStore from './app.js';
// eslint-disable-next-line import/no-unresolved
import 'Sass/app.scss';

const App = ({ root_store }) => {
    const l = window.location;
    const base = l.pathname.split('/')[1];
    const has_base = /^\/(br_)/.test(l.pathname);
    const url_params = new URLSearchParams(l.search);

    React.useEffect(() => {
        initializeTranslations();
    }, []);

    if (isMobile()) {
        React.useEffect(() => {
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

            // componentWillUnmount lifecycle
            return () => {
                document.removeEventListener('focus', onFocus);
                document.removeEventListener('focusout', onFocusOut);
                document.removeEventListener('touchstart', onTouchStart);
            };
        }, []);
    }

    const platform_passthrough = {
        root_store,
        WS,
        client_base: Client,
    };

    return (
        <Router basename={has_base ? `/${base}` : null}>
            <MobxProvider store={root_store}>
                <React.Fragment>
                    <Header />
                    <ErrorBoundary>
                        <AppContents>
                            {/* TODO: [trader-remove-client-base] */}
                            <Routes passthrough={platform_passthrough} />
                            <Prompt when={true} message={interceptAcrossBot} />
                        </AppContents>
                    </ErrorBoundary>
                    <DesktopWrapper>
                        <Footer />
                    </DesktopWrapper>
                    <AppModals url_action_param={url_params.get('action')} />
                    <SmartTraderIFrame />
                </React.Fragment>
            </MobxProvider>
        </Router>
    );
};

App.propTypes = {
    root_store: PropTypes.object,
};

export default App;

const root_store = initStore(NotificationMessages);

const wrapper = document.getElementById('deriv_app');
// eslint-disable-next-line no-unused-expressions
wrapper ? ReactDOM.render(<App root_store={root_store} />, wrapper) : false;
