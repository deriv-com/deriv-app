import React from 'react';
import { DesktopWrapper } from '@deriv/components';
import { useFeatureFlags } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import { getActiveLoginIDFromLocalStorage } from '@deriv/utils';
import BinaryBotIFrame from 'Modules/BinaryBotIFrame';
import SmartTraderIFrame from 'Modules/SmartTraderIFrame';
import ErrorBoundary from './Components/Elements/Errors/error-boundary.jsx';
import AppContents from './Containers/Layout/app-contents.jsx';
import Footer from './Containers/Layout/footer.jsx';
import Header from './Containers/Layout/header';
import AppModals from './Containers/Modals';
import PlatformContainer from './Containers/PlatformContainer/PlatformContainer.jsx';
import Routes from './Containers/Routes/routes.jsx';
import AppToastMessages from './Containers/app-toast-messages.jsx';
import Devtools from './Devtools';

const AppContent: React.FC<{ passthrough: unknown }> = observer(({ passthrough }) => {
    const { is_next_wallet_enabled } = useFeatureFlags();
    const { client } = useStore();

    React.useEffect(() => {
        const handleSwitching = () => {
            const loginid = getActiveLoginIDFromLocalStorage();
            client.switchAccount(loginid);
        };

        window.addEventListener('loginid-changed', handleSwitching);

        return () => {
            window.removeEventListener('loginid-changed', handleSwitching);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <PlatformContainer>
            <Header />
            <ErrorBoundary>
                <AppContents>
                    {/* TODO: [trader-remove-client-base] */}
                    <Routes passthrough={passthrough} />
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
            {is_next_wallet_enabled && <Devtools />}
        </PlatformContainer>
    );
});

export default AppContent;
