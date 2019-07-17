import PropTypes                   from 'prop-types';
import React                       from 'react';
import ReactDOM                    from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { MobxProvider }            from 'Stores/connect';
import ErrorBoundary               from './Components/Elements/Errors/error-boundary.jsx';
import PushNotification            from './Containers/push-notification.jsx';
import AppContents                 from './Containers/Layout/app-contents.jsx';
import Footer                      from './Containers/Layout/footer.jsx';
import Header                      from './Containers/Layout/header.jsx';
import Routes                      from './Containers/Routes/routes.jsx';
import AccountSignupModal          from './Containers/AccountSignupModal';
import DenialOfServiceModal        from './Containers/DenialOfServiceModal';
import MarketUnavailableModal      from './Containers/MarketUnavailableModal';
import ServicesErrorModal          from './Containers/ServicesErrorModal';
import UnsupportedContractModal    from './Containers/UnsupportedContractModal';
import Wip                         from './Containers/Wip';
import './i18n';
import initStore                   from './app.js';
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
                        <Wip /> :
                        <React.Fragment>
                            <Header />
                            <ErrorBoundary>
                                <AppContents>
                                    <Routes />
                                    <PushNotification />
                                </AppContents>
                                <AccountSignupModal />
                                <UnsupportedContractModal />
                                <DenialOfServiceModal />
                                <MarketUnavailableModal />
                                <ServicesErrorModal />
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
wrapper ? ReactDOM.render(<App root_store={root_store} />, wrapper) : false;
