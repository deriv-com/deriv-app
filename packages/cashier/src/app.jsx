import React from 'react';
import { setWebsocket } from '@deriv/shared';
import { ThemeProvider } from '@deriv/ui';
import { init } from 'Utils/server_time';
import CashierProviders from './cashier-providers';
import AppThemeContent from './app-theme-content';

const App = ({ passthrough: { WS, root_store } }) => {
    React.useEffect(() => {
        setWebsocket(WS);
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <ThemeProvider>
            <CashierProviders store={root_store}>
                <AppThemeContent />
            </CashierProviders>
        </ThemeProvider>
    );
};

export default App;
