import React from 'react';
import Routes from 'Containers/routes';
import { observer, useStore } from '@deriv/stores';
import { useTheme } from '@deriv/ui';

const AppContent = () => {
    const {
        ui: { is_dark_mode_on },
    } = useStore();

    const { setColorMode } = useTheme();

    React.useEffect(() => {
        const theme = (is_dark_mode_on ? 'dark' : 'light') as Parameters<typeof setColorMode>[0];
        setColorMode(theme);
    }, [is_dark_mode_on, setColorMode]);

    return <Routes />;
};

export default observer(AppContent);
