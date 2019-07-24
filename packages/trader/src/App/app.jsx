import PropTypes                   from 'prop-types';
import React                       from 'react';
import ReactDOM                    from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { MobxProvider }            from 'Stores/connect';
import ErrorBoundary               from './Components/Elements/Errors/error-boundary.jsx';
import AppContents                 from './Containers/Layout/app-contents.jsx';
import Footer                      from './Containers/Layout/footer.jsx';
import Header                      from './Containers/Layout/header.jsx';
import Lazy                        from './Containers/Lazy';
import Routes                      from './Containers/Routes/routes.jsx';
import './i18n';
// eslint-disable-next-line import/extensions
import initStore                   from './app.js';
// eslint-disable-next-line import/no-unresolved
import 'Sass/app.scss';
// Check if device is touch capable
const isTouchDevice = 'ontouchstart' in document.documentElement;

const App = ({ root_store }) => {
    const l = window.location;
    const base = l.pathname.split('/')[1];
    return (
        <Router basename={/^\/br_/.test(l.pathname) ? `/${base}` : null}>
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
                                    <Routes />
                                    <Lazy
                                        ctor={() => import(/* webpackChunkName: "push-notification" */'./Containers/push-notification.jsx')}
                                        should_load={true}
                                        has_progress={false}
                                    />
                                </AppContents>
                                <Lazy
                                    ctor={() => import(/* webpackChunkName: "modals" */'./Containers/Modals')}
                                    has_progress={true}
                                    should_load={true}
                                />
                            </ErrorBoundary>
                            <Footer />
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

const root_store = initStore();

const wrapper = document.getElementById('deriv_app');
// eslint-disable-next-line no-unused-expressions
wrapper ? ReactDOM.render(<App root_store={root_store} />, wrapper) : false;
