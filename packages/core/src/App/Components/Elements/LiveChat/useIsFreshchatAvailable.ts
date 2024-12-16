import { useEffect, useState } from 'react';

const useIsFreshchatAvailable = () => {
    const [is_ready, setIsReady] = useState(false);

    useEffect(() => {
        const TIMEOUT_DURATION = 5000;
        const startTime = Date.now();

        const checkFreshchat = setInterval(() => {
            if (window?.fcWidget?.isInitialized()) {
                setIsReady(true);
                clearInterval(checkFreshchat);
            } else if (Date.now() - startTime >= TIMEOUT_DURATION) {
                clearInterval(checkFreshchat);
            }
        }, 100);

        return () => clearInterval(checkFreshchat);
    }, []);

    return is_ready;
};

export default useIsFreshchatAvailable;
