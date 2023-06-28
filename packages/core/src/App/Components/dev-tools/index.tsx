import React from 'react';
import MockDialog from './mock-dialog';
import { useLocalStorageData } from '@deriv/hooks';

const DevTools = () => {
    const { data, setData } = useLocalStorageData<boolean>('is_mockserver_enabled');

    React.useEffect(() => {
        const handleShortcutKey = (event: globalThis.KeyboardEvent) => {
            if (event.ctrlKey && event.key === '3') {
                setData(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleShortcutKey);

        return () => {
            window.removeEventListener('keydown', handleShortcutKey);
        };
    }, [setData]);

    if (data) {
        return <MockDialog />;
    }

    return <React.Fragment />;
};

export default DevTools;
