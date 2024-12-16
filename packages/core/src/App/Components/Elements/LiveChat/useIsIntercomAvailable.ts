import { useEffect, useState } from 'react';

const useIsIntercomAvailable = () => {
    const [is_ready, setIsReady] = useState(false);

    useEffect(() => {
        const TIMEOUT_DURATION = 5000;
        const startTime = Date.now();

        const checkIntercom = setInterval(() => {
            if (typeof window.Intercom === 'function') {
                setIsReady(true);
                clearInterval(checkIntercom);
            } else if (Date.now() - startTime >= TIMEOUT_DURATION) {
                clearInterval(checkIntercom);
            }
        }, 100);

        return () => clearInterval(checkIntercom);
    }, []);

    return is_ready;
};

export default useIsIntercomAvailable;
