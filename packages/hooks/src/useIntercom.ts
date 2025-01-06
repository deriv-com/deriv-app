import { useEffect, useState } from 'react';
import { useScript } from 'usehooks-ts';

import useGrowthbookGetFeatureValue from './useGrowthbookGetFeatureValue';

export const useIntercom = (token: string | null) => {
    const intercom_script = 'https://static.deriv.com/scripts/intercom/v1.0.1.js';
    const [enable_intercom] = useGrowthbookGetFeatureValue({
        featureFlag: 'enable_intercom',
    });
    const scriptStatus = useScript(intercom_script);

    useEffect(() => {
        if (!enable_intercom || scriptStatus !== 'ready' || !window?.DerivInterCom) {
            if (!enable_intercom && window.Intercom) {
                console.log(`intercom shutdown`);
                window.Intercom('shutdown');
            }
            return;
        }

        let intervalId: NodeJS.Timeout;

        const initIntercom = () => {
            console.log(`intercom init`);
            window.DerivInterCom.initialize({
                hideLauncher: true,
                token,
            });

            intervalId = setInterval(() => {
                if (window?.Intercom) {
                    clearInterval(intervalId);
                }
            }, 500);
        };

        initIntercom();

        return () => {
            clearInterval(intervalId);
        };
    }, [enable_intercom, scriptStatus, token]);
};

export const useIsIntercomAvailable = () => {
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

export default useIntercom;
