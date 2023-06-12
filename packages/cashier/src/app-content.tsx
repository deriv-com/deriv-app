import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { useTheme } from '@deriv/ui';
import Routes from './containers/routes';
import useUnsafeCashierRouteHandler from './containers/routes/useUnsafeCashierRouteHandler';

const AppContent: React.FC = observer(() => {
    const { ui } = useStore();
    const { is_dark_mode_on, notification_messages_ui: Notifications } = ui;
    const { setColorMode } = useTheme();
    useUnsafeCashierRouteHandler();

    React.useEffect(() => {
        const theme = is_dark_mode_on ? 'dark' : 'light';
        // @ts-expect-error setColorMode accepts a enum as a parameter which is not exported,
        // It should be refactored to union type instead.
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
