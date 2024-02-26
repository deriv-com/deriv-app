import React from 'react';
import { DesktopWrapper } from '@deriv/components';
import { useFeatureFlags } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
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
import Cookies from 'js-cookie';
import { useRemoteConfig } from '@deriv/api';
import { LocalStore, getAppId } from '@deriv/shared';
import { Analytics } from '@deriv-com/analytics';
import { getLanguage } from '@deriv/translations';

const AppContent: React.FC<{ passthrough: unknown }> = observer(({ passthrough }) => {
    const { is_next_wallet_enabled } = useFeatureFlags();
    const store = useStore();

    const { data } = useRemoteConfig();

    React.useEffect(() => {
        if (process.env.RUDDERSTACK_KEY) {
            const config = {
                growthbookKey: data.marketing_growthbook ? process.env.GROWTHBOOK_CLIENT_KEY : undefined,
                growthbookDecryptionKey: data.marketing_growthbook ? process.env.GROWTHBOOK_DECRYPTION_KEY : undefined,
                rudderstackKey: process.env.RUDDERSTACK_KEY,
            };
            Analytics.initialise(config);
            Analytics.setAttributes({
                account_type: LocalStore?.get('active_loginid')?.substring(0, 2) ?? 'unlogged',
                app_id: String(getAppId()),
                device_type: store?.ui?.is_mobile ? 'mobile' : 'desktop',
                device_language: navigator?.language || 'en-EN',
                user_language: getLanguage().toLowerCase(),
                country: Cookies.get('clients_country') || Cookies?.getJSON('website_status'),
            });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    return (
        <PlatformContainer>
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
            {is_next_wallet_enabled && <Devtools />}
        </PlatformContainer>
    );
});

export default AppContent;
