import { useEffect, useState } from 'react';
import { useScript } from 'usehooks-ts';
import { getAppId, getSocketURL } from '@deriv/shared';

const useFreshChat = (token: string | null) => {
    const scriptStatus = useScript('https://static.deriv.com/scripts/freshchat-temp.js');
    const [isReady, setIsReady] = useState(false);
    const language = localStorage.getItem('i18n_language') || 'EN';
    const serverUrl = getSocketURL();
    const appId = getAppId();

    useEffect(() => {
        const checkFcWidget = (intervalId: NodeJS.Timeout) => {
            if (typeof window !== 'undefined') {
                if (window.fcWidget?.isInitialized() == true && !isReady) {
                    setIsReady(true);
                    clearInterval(intervalId);
                }
            }
        };

        const initFreshChat = async () => {
            if (scriptStatus === 'ready' && window.FreshChat && window.fcSettings) {
                window.FreshChat.initialize({
                    token,
                    hideButton: true,
                    serverUrl,
                    appId,
                });

                const intervalId = setInterval(() => checkFcWidget(intervalId), 500);

                return () => clearInterval(intervalId);
            }
        };

        initFreshChat();
    }, [appId, isReady, language, scriptStatus, serverUrl, token]);

    return {
        isReady,
        widget: window.fcWidget,
    };
};

export default useFreshChat;
