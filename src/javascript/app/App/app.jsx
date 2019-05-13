import PropTypes                   from 'prop-types';
import React                       from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import getBaseName                 from 'Utils/URL/base-name';
import { MobxProvider }            from 'Stores/connect';
import ErrorBoundary               from './Components/Elements/Errors/error-boundary.jsx';
import { POSITIONS }               from './Components/Elements/ToastMessage';
import PushNotification            from './Containers/push-notification.jsx';
import ToastMessage                from './Containers/toast-message.jsx';
import AppContents                 from './Containers/Layout/app-contents.jsx';
import Footer                      from './Containers/Layout/footer.jsx';
import Header                      from './Containers/Layout/header.jsx';
import Routes                      from './Containers/Routes/routes.jsx';
import DenialOfServiceModal        from './Containers/DenialOfServiceModal';
import MarketUnavailableModal      from './Containers/MarketUnavailableModal';
import ServicesErrorModal          from './Containers/ServicesErrorModal';
import Wip                         from './Containers/Wip';

// Check if device is touch capable
const isTouchDevice = 'ontouchstart' in document.documentElement;

const App = ({ root_store }) => (
    <Router basename={getBaseName()}>
        <MobxProvider store={root_store}>
            {
                root_store.ui.is_mobile || (root_store.ui.is_tablet && isTouchDevice) ?
                    <Wip /> :
                    <React.Fragment>
                        <Header />
                        <ErrorBoundary>
                            <AppContents>
                                <Routes />
                                <ToastMessage position={POSITIONS.TOP_RIGHT} />
                                <PushNotification />
                            </AppContents>
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

App.propTypes = {
    root_store: PropTypes.object,
};

export default App;
