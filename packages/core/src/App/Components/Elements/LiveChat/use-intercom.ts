import { useEffect, useState } from 'react';
import { useScript } from 'usehooks-ts';

import { useGrowthbookGetFeatureValue } from '@deriv/hooks';

const useIntercom = ({ userData, hideLauncher }: IntercomConfig) => {
    const intercom_script = 'https://static.deriv.com/scripts/intercom/v1.0.0.js';
    const [should_load_script, setShouldLoadScript] = useState(false);
    const scriptStatus = useScript(should_load_script ? intercom_script : null);

    const [is_ready, setIsReady] = useState(false);
    const [is_script_ready, setIsScriptReady] = useState(false);
    const [enable_intercom, isGBLoaded] = useGrowthbookGetFeatureValue({
        featureFlag: 'enable_intercom',
    });

    useEffect(() => {
        if (should_load_script && scriptStatus === 'ready') {
            setIsScriptReady(true);
        }
    }, [scriptStatus]);

    useEffect(() => {
        const checkIntercom = (intervalId: NodeJS.Timeout) => {
            if (typeof window !== 'undefined') {
                if (window.Intercom && !is_ready) {
                    setIsReady(true);
                    clearInterval(intervalId);
                }
            }
        };

        const initIntercom = async () => {
            window.DerivInterCom.initialize({
                userData,
                hideLauncher,
            });

            const intervalId = setInterval(() => checkIntercom(intervalId), 500);

            return () => clearInterval(intervalId);
        };

        if (enable_intercom && isGBLoaded) {
            setShouldLoadScript(true);

            if (is_script_ready) {
                initIntercom();
            }
        }
    }, [enable_intercom, isGBLoaded, is_script_ready]);

    return {
        is_ready,
        widget: window?.Intercom,
    };
};

export default useIntercom;
