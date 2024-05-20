import React from 'react';
import { useRemoteConfig } from '@deriv/api';
import { DesktopWrapper } from '@deriv/components';
import { useIsMounted } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { browserSupportsWebAuthn } from '@simplewebauthn/browser';

import BinaryBotIFrame from 'Modules/BinaryBotIFrame';
import SmartTraderIFrame from 'Modules/SmartTraderIFrame';

import ErrorBoundary from './Components/Elements/Errors/error-boundary.jsx';
import AppToastMessages from './Containers/app-toast-messages.jsx';
import AppContents from './Containers/Layout/app-contents.jsx';
import Footer from './Containers/Layout/footer.jsx';
import Header from './Containers/Layout/header';
import AppModals from './Containers/Modals';
import Routes from './Containers/Routes/routes.jsx';
import Devtools from './Devtools';
import initDatadog from '../Utils/Datadog';
import { ThemeProvider } from '@deriv-com/quill-ui';

const AppContent: React.FC<{ passthrough: unknown }> = observer(({ passthrough }) => {
    const store = useStore();
    const { has_wallet } = store.client;

    const isMounted = useIsMounted();
    const { data } = useRemoteConfig(isMounted());
    const { tracking_datadog, passkeys } = data;
    const is_passkeys_supported = browserSupportsWebAuthn();

    React.useEffect(() => {
        store.client.setIsPasskeySupported(is_passkeys_supported && passkeys);
    }, [passkeys, is_passkeys_supported, store.client]);

    React.useEffect(() => {
        initDatadog(tracking_datadog);
    }, [tracking_datadog]);

    // intentionally switch the user with wallets to light mode and EN language
    React.useLayoutEffect(() => {
        if (has_wallet) {
            if (store.ui.is_dark_mode_on) {
                store.ui.setDarkMode(false);
            }
            if (store.common.current_language !== 'EN') {
                store.common.changeSelectedLanguage('EN');
            }
        }
    }, [has_wallet, store.common, store.ui]);

    return (
        <ThemeProvider theme={store.ui.is_dark_mode_on ? 'dark' : 'light'}>
            <Header />
            <ErrorBoundary root_store={store}>
                <AppContents>
                    {/* TODO: [trader-remove-client-base] */}
                    <Routes passthrough={passthrough} />
                </AppContents>
            </ErrorBoundary>
            <DesktopWrapper>
                <Footer />
            </DesktopWrapper>
            <ErrorBoundary root_store={store}>
                <AppModals />
            </ErrorBoundary>
            <SmartTraderIFrame />
            <BinaryBotIFrame />
            <AppToastMessages />
            <Devtools />
        </ThemeProvider>
    );
});

export default AppContent;
