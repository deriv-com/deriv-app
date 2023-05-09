import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { DesktopWrapper } from '@deriv/components';
import { APIProvider } from '@deriv/api';
import { setUrlLanguage, initFormErrorMessages, setSharedCFDText } from '@deriv/shared';
import { initializeTranslations, getLanguage, TranslationProvider } from '@deriv/translations';
import { StoreProvider } from '@deriv/stores';
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
import 'Sass/app.scss';

const App = ({ root_store }) => {
    const l = window.location;
    const base = l.pathname.split('/')[1];
    const has_base = /^\/(br_)/.test(l.pathname);

    React.useEffect(() => {
        initializeTranslations();

        // TODO: [translation-to-shared]: add translation implemnentation in shared
        setUrlLanguage(getLanguage());
        initFormErrorMessages(FORM_ERROR_MESSAGES);
        setSharedCFDText(CFD_TEXT);
        root_store.common.setPlatform();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const platform_passthrough = {
        root_store,
        WS,
    };

    return (
        <TranslationProvider>
            <Router basename={has_base ? `/${base}` : null}>
                <MobxContentProvider store={root_store}>
                    <StoreProvider store={root_store}>
                        <APIProvider>
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
                        </APIProvider>
                    </StoreProvider>
                </MobxContentProvider>
            </Router>
        </TranslationProvider>
    );
};

export default App;
