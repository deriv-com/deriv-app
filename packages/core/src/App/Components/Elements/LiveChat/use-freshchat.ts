import { useEffect, useState } from 'react';
import { useScript } from 'usehooks-ts';

import { useGrowthbookGetFeatureValue } from '@deriv/hooks';

const useFreshChat = (token: string | null) => {
    const scriptStatus = useScript('https://static.deriv.com/scripts/freshchat.js');
    const [is_ready, setis_ready] = useState(false);
    const [enable_freshworks_live_chat, isGBLoaded] = useGrowthbookGetFeatureValue({
        featureFlag: 'enable_freshworks_live_chat',
    });

    useEffect(() => {
        const checkFcWidget = (intervalId: NodeJS.Timeout) => {
            if (typeof window !== 'undefined') {
                if (window.fcWidget?.isInitialized() == true && !is_ready) {
                    setis_ready(true);
                    clearInterval(intervalId);
                }
            }
        };

        const initFreshChat = async () => {
            if (scriptStatus === 'ready' && window.FreshChat && window.fcSettings) {
                window.FreshChat.initialize({
                    token,
                    hideButton: true,
                });

                const intervalId = setInterval(() => checkFcWidget(intervalId), 500);

                return () => clearInterval(intervalId);
            }
        };

        enable_freshworks_live_chat && isGBLoaded && initFreshChat();
    }, [enable_freshworks_live_chat, isGBLoaded, is_ready, scriptStatus, token]);

    return {
        is_ready,
        widget: window.fcWidget,
    };
};

export default useFreshChat;
