import { useEffect, useState } from 'react';
import { useScript } from 'usehooks-ts';

const useIntercom = (token: string | null, flag: boolean) => {
    const intercom_script = 'https://static.deriv.com/scripts/intercom/v1.0.1.js';
    const scriptStatus = useScript(flag ? intercom_script : null);

    const [is_ready, setIsReady] = useState(false);

    useEffect(() => {
        if (!flag || scriptStatus !== 'ready' || !window?.DerivInterCom) return;

        let intervalId: NodeJS.Timeout;

        const initIntercom = () => {
            window.DerivInterCom.initialize({
                hideLauncher: true,
                token,
            });

            intervalId = setInterval(() => {
                if (window?.Intercom && !is_ready) {
                    setIsReady(true);
                    clearInterval(intervalId);
                }
            }, 500);
        };

        initIntercom();

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [flag, is_ready, scriptStatus, token]);

    return { is_ready };
};

export default useIntercom;
