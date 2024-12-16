import { useEffect } from 'react';
import { useScript } from 'usehooks-ts';

import useGrowthbookGetFeatureValue from './useGrowthbookGetFeatureValue';

const useIntercom = (token: string | null) => {
    const intercom_script = 'https://static.deriv.com/scripts/intercom/v1.0.1.js';
    const [enable_intercom] = useGrowthbookGetFeatureValue({
        featureFlag: 'enable_intercom',
    });
    const scriptStatus = useScript(enable_intercom ? intercom_script : null);

    useEffect(() => {
        if (!enable_intercom || scriptStatus !== 'ready' || !window?.DerivInterCom) return;

        let intervalId: NodeJS.Timeout;

        const initIntercom = () => {
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

export default useIntercom;
