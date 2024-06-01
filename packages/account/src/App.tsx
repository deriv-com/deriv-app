import Routes from './Containers/routes';
import ResetTradingPassword from './Containers/reset-trading-password';
import { NetworkStatusToastErrorPopup } from './Containers/toast-popup';
import { APIProvider } from '@deriv/api';
import { StoreProvider } from '@deriv/stores';
import { TCoreStores } from '@deriv/stores/types';
import { POIProvider } from '@deriv/shared';
import { initializeI18n, TranslationProvider, getInitialLanguage } from '@deriv-com/translations';

// TODO: add correct types for WS after implementing them
type TAppProps = {
    passthrough: {
        root_store: TCoreStores;
        WS: Record<string, any>;
    };
};

type TLanguage = Exclude<Parameters<typeof TranslationProvider>[0]['defaultLang'], undefined>;

// Replace the `cdnUrl` with the correct URL (https://pub-5ce11fcb15f34c0a9ce8ba7086d16e6a.r2.dev/deriv-app/account)

const i18nInstance = initializeI18n({ cdnUrl: 'https://pub-5ce11fcb15f34c0a9ce8ba7086d16e6a.r2.dev' });

const App = ({ passthrough }: TAppProps) => {
    const { root_store } = passthrough;

    const { notification_messages_ui: Notifications } = root_store.ui;

    const language = getInitialLanguage();

    return (
        <TranslationProvider defaultLang={language as TLanguage} i18nInstance={i18nInstance}>
            <StoreProvider store={root_store}>
                <NetworkStatusToastErrorPopup />
                <APIProvider>
                    <POIProvider>
                        {Notifications && <Notifications />}
                        <Routes />
                        <ResetTradingPassword />
                    </POIProvider>
                </APIProvider>
            </StoreProvider>
        </TranslationProvider>
    );
};

export default App;
