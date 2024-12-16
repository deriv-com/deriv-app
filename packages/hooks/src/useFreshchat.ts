import { useEffect, useState } from 'react';
import { useScript } from 'usehooks-ts';

import useGrowthbookGetFeatureValue from './useGrowthbookGetFeatureValue';

const useFreshChat = (token: string | null) => {
    const freshchatScript = 'https://static.deriv.com/scripts/freshchat/v1.0.2.js';
    const [enable_freshworks_live_chat] = useGrowthbookGetFeatureValue({
        featureFlag: 'enable_freshworks_live_chat',
    });
    const scriptStatus = useScript(enable_freshworks_live_chat ? freshchatScript : null);

    useEffect(() => {
        if (!enable_freshworks_live_chat || scriptStatus !== 'ready' || !window.FreshChat || !window.fcSettings) {
            return;
        }

        let checkInterval: NodeJS.Timeout;

        const initializeFreshChat = () => {
            window.FreshChat.initialize({
                hideButton: true,
                token,
            });

            checkInterval = setInterval(() => {
                if (window?.fcWidget?.isInitialized()) {
                    clearInterval(checkInterval);
                }
            }, 500);
        };

        initializeFreshChat();

        return () => {
            clearInterval(checkInterval);
        };
    }, [enable_freshworks_live_chat, scriptStatus, token]);
};

export const useIsFreshchatAvailable = () => {
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

export default useFreshChat;
