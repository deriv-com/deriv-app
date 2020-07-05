import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
// Initialize i18n by importing it here
// eslint-disable-next-line no-unused-vars
import { DesktopWrapper } from '@deriv/components';
import { checkAndSetEndpointFromUrl, setUrlLanguage, isMobile } from '@deriv/shared';
import { initializeTranslations, getLanguage } from '@deriv/translations';
import Client from '_common/base/client_base';
import WS from 'Services/ws-methods';
import { MobxContentProvider } from 'Stores/connect';
import SmartTraderIFrame from 'Modules/SmartTraderIFrame';
import ErrorBoundary from './Components/Elements/Errors/error-boundary.jsx';
import AppContents from './Containers/Layout/app-contents.jsx';
import Footer from './Containers/Layout/footer.jsx';
import Header from './Containers/Layout/header.jsx';
import AppNotificationMessages from './Containers/app-notification-messages.jsx';
import AppModals from './Containers/Modals';
import Routes from './Containers/Routes/routes.jsx';
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
        checkAndSetEndpointFromUrl();
        initializeTranslations();
        setUrlLanguage(getLanguage());
    }, []);

    const platform_passthrough = {
        root_store,
        WS,
        client_base: Client,
    };

    return (
        <Router basename={has_base ? `/${base}` : null}>
            <MobxContentProvider store={root_store}>
                <React.Fragment>
                    <Header />
                    <ErrorBoundary>
                        <AppContents>
                            {/* TODO: [trader-remove-client-base] */}
                            <Routes passthrough={platform_passthrough} isMobile={isMobile} />
                        </AppContents>
                    </ErrorBoundary>
                    <DesktopWrapper>
                        <Footer />
                    </DesktopWrapper>
                    <AppModals url_action_param={url_params.get('action')} />
                    <SmartTraderIFrame />
                </React.Fragment>
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
