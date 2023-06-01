import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { useTheme } from '@deriv/ui';
import Routes from './containers/routes';
import useUnsafeCashierRouteHandler from './containers/routes/useUnsafeCashierRouteHandler';

const AppContent = observer(() => {
    const { ui } = useStore();
    const { is_dark_mode_on, notification_messages_ui: Notifications } = ui;
    const { setColorMode } = useTheme();
    useUnsafeCashierRouteHandler();

    React.useEffect(() => {
        const theme = (is_dark_mode_on ? 'dark' : 'light') as Parameters<typeof setColorMode>[0];
        setColorMode(theme);
    }, [is_dark_mode_on, setColorMode]);

    return (
        <>
            {Notifications && <Notifications />}
            <Routes />
        </>
    );
});

export default AppContent;
