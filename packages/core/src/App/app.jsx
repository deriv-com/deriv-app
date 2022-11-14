import PropTypes from 'prop-types';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
// Initialize i18n by importing it here
// eslint-disable-next-line no-unused-vars
import debounce from 'lodash.debounce';
import { withTranslation } from 'react-i18next';
import { DesktopWrapper } from '@deriv/components';
import {
    setUrlLanguage,
    isMobile,
    isTablet,
    isTouchDevice,
    initFormErrorMessages,
    mobileOSDetect,
    routes,
    setSharedCFDText,
    useOnLoadTranslation,
} from '@deriv/shared';
import { initializeTranslations, getLanguage } from '@deriv/translations';
import { CashierStore } from '@deriv/cashier';
import WS from 'Services/ws-methods';
import { MobxContentProvider } from 'Stores/connect';
import SmartTraderIFrame from 'Modules/SmartTraderIFrame';
import BinaryBotIFrame from 'Modules/BinaryBotIFrame';
import AppToastMessages from './Containers/app-toast-messages.jsx';
import ErrorBoundary from './Components/Elements/Errors/error-boundary.jsx';
import AppContents from './Containers/Layout/app-contents.jsx';
import PlatformContainer from './Containers/PlatformContainer/PlatformContainer.jsx';
import Footer from './Containers/Layout/footer.jsx';
import Header from './Containers/Layout/header';
import AppModals from './Containers/Modals';
import Routes from './Containers/Routes/routes.jsx';
import { FORM_ERROR_MESSAGES } from '../Constants/form-error-messages';
import { CFD_TEXT } from '../Constants/cfd-text';

// TODO: Lazy load smartchart styles
import '@deriv/deriv-charts/dist/smartcharts.css';
// eslint-disable-next-line import/extensions
// eslint-disable-next-line import/no-unresolved
import 'Sass/app.scss';

const AppWithoutTranslation = ({ root_store }) => {
    const l = window.location;
    const base = l.pathname.split('/')[1];
    const has_base = /^\/(br_)/.test(l.pathname);
    const [is_translation_loaded] = useOnLoadTranslation();
    const initCashierStore = () => {
        root_store.modules.attachModule('cashier', new CashierStore({ root_store, WS }));
        root_store.modules.cashier.general_store.init();
    };
    // TODO: investigate the order of cashier store initialization
    // eslint-disable-next-line react-hooks/exhaustive-deps
    React.useEffect(initCashierStore, []);
    React.useEffect(() => {
        initializeTranslations();

        // TODO: [translation-to-shared]: add translation implemnentation in shared
        setUrlLanguage(getLanguage());
        initFormErrorMessages(FORM_ERROR_MESSAGES);
        setSharedCFDText(CFD_TEXT);
        handleResize();
        root_store.common.setPlatform();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleResize = React.useCallback(() => {
        if (isTouchDevice() && (isMobile() || isTablet())) {
            const is_android_device = mobileOSDetect() === 'Android';
            const view_width = is_android_device ? screen.availWidth : window.innerWidth;
            const view_height = is_android_device ? screen.availHeight : window.innerHeight;
            const el_landscape_blocker = document.getElementById('landscape_blocker');

            if (
                view_width <= view_height ||
                root_store.modules?.cashier?.general_store?.is_user_on_p2p ||
                window.location.pathname.endsWith(routes.cashier_p2p)
            ) {
                root_store.ui.onOrientationChange({ is_landscape_orientation: false });
                el_landscape_blocker.classList.remove('landscape-blocker--visible');
            } else {
                root_store.ui.onOrientationChange({ is_landscape_orientation: true });
                el_landscape_blocker.classList.add('landscape-blocker--visible');
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                            <ErrorBoundary>
                                <AppModals />
                            </ErrorBoundary>
                            <SmartTraderIFrame />
                            <BinaryBotIFrame />
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

AppWithoutTranslation.propTypes = {
    root_store: PropTypes.object,
};
const App = withTranslation()(AppWithoutTranslation);

export default App;
