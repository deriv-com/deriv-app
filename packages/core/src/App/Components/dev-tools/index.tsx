import React from 'react';
import MockDialog from './mock-dialog';
import { useLocalStorageData } from '@deriv/hooks';

const DevTools = () => {
    const [show_mockserver_panel, setShowMockServerPanel] = useLocalStorageData<boolean>(
        'show_mockserver_panel',
        false
    );

    React.useEffect(() => {
        const handleShortcutKey = (event: globalThis.KeyboardEvent) => {
            if (event.ctrlKey && event.key === '0') {
                setShowMockServerPanel(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleShortcutKey);

        return () => {
            window.removeEventListener('keydown', handleShortcutKey);
        };
    }, [setShowMockServerPanel]);

    if (show_mockserver_panel) {
        return <MockDialog />;
    }

    return <React.Fragment />;
};

export default DevTools;
