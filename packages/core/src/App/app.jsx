import PropTypes                    from 'prop-types';
import React                        from 'react';
import ReactDOM                     from 'react-dom';
import { Prompt }                   from 'react-router';
import { BrowserRouter as Router }  from 'react-router-dom';
// Initialize i18n by importing it here
// eslint-disable-next-line no-unused-vars
import { i18n,
    loadIncontextTranslation }      from 'deriv-translations';
import Client                       from '_common/base/client_base';
import WS                           from 'Services/ws-methods';
import { MobxProvider }             from 'Stores/connect';
import ErrorBoundary                from './Components/Elements/Errors/error-boundary.jsx';
import AppContents                  from './Containers/Layout/app-contents.jsx';
import Footer                       from './Containers/Layout/footer.jsx';
import Header                       from './Containers/Layout/header.jsx';
import NotificationMessages         from './Containers/notification-messages.jsx';
import AppModals                    from './Containers/Modals';
import Lazy                         from './Containers/Lazy';
import Routes                       from './Containers/Routes/routes.jsx';
import { interceptAcrossBot }       from './Constants/routes-config';
// eslint-disable-next-line import/extensions
import initStore                   from './app.js';
// eslint-disable-next-line import/no-unresolved
import 'Sass/app.scss';
// Check if device is touch capable
const isTouchDevice = 'ontouchstart' in document.documentElement;

const App = ({ root_store }) => {
    const l = window.location;
    const base = l.pathname.split('/')[1];
    const has_base = /^\/(br_)/.test(l.pathname);
    const url_params = new URLSearchParams(l.search);

    const is_staging = /staging\.deriv\.app/i.test(l.hostname);
    if (is_staging) {
        loadIncontextTranslation();
    }

    const platform_passthrough = {
        root_store,
        WS,
        client_base: Client,
    };

    return (
        <Router basename={ has_base ? `/${base}` : null}>
            <MobxProvider store={root_store}>
                {
                    root_store.ui.is_mobile || (root_store.ui.is_tablet && isTouchDevice) ?
                        <Lazy
                            ctor={() => import(/* webpackChunkName: "work-in-progress" */'./Containers/Wip')}
                            should_load={root_store.ui.is_mobile || (root_store.ui.is_tablet && isTouchDevice)}
                            has_progress={true}
                        /> :
                        <React.Fragment>
                            <Header />
                            <ErrorBoundary>
                                <AppContents>
                                    {/* TODO: [trader-remove-client-base] */}
                                    <Routes passthrough={ platform_passthrough } />
                                    <Prompt when={ true } message={ interceptAcrossBot } />
                                    <Lazy
                                        ctor={() => import(/* webpackChunkName: "push-notification" */'./Containers/push-notification.jsx')}
                                        should_load={!root_store.ui.is_loading}
                                        has_progress={false}
                                    />
                                </AppContents>
                            </ErrorBoundary>
                            <Footer />
                            <AppModals url_action_param={ url_params.get('action') } />
                        </React.Fragment>
                }
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
