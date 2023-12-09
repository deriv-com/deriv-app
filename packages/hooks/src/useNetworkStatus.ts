import React from 'react';

type TNetworkStatus = {
    online: boolean;
    since: number | undefined;
};

const useNetworkStatus = () => {
    const [status, setStatus] = React.useState<TNetworkStatus>(() => ({
        online: navigator.onLine,
        since: undefined,
    }));

    React.useEffect(() => {
        const handleOnline = () => {
            setStatus(prevState => ({
                ...prevState,
                online: true,
                since: Date.now(),
            }));
        };

        const handleOffline = () => {
            setStatus(prevState => ({
                ...prevState,
                online: false,
                since: Date.now(),
            }));
        };
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return status;
};

export default useNetworkStatus;
