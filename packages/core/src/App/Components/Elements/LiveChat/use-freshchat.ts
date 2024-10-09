import { useStore } from '@deriv/stores';
import { useEffect, useState } from 'react';
import { useScript } from 'usehooks-ts';

const useFreshChat = () => {
    const scriptStatus = useScript('https://static.deriv.com/scripts/freshchat-temp.js');
    const [isReady, setIsReady] = useState(false);

    const { client } = useStore();
    const { loginid, accounts } = client;
    const active_account = accounts?.[loginid ?? ''];
    const token = active_account ? active_account.token : null;
    useEffect(() => {
        const checkFcWidget = (intervalId: NodeJS.Timeout) => {
            if (typeof window !== 'undefined' && window.fcWidget) {
                window.fcWidget.on('widget:loaded', () => {
                    // eslint-disable-next-line no-console
                    console.log('fc widget loaded');
                    setIsReady(true);
                    clearInterval(intervalId);
                });
            }
        };

        const initFreshChat = async () => {
            if (scriptStatus === 'ready' && window.FreshChat && window.fcSettings) {
                window.FreshChat.initialize({
                    token,
                    locale: 'en',
                    hideButton: true,
                });

                const intervalId = setInterval(() => checkFcWidget(intervalId), 500);

                return () => clearInterval(intervalId); // Cleanup interval on unmount or script change
            }
        };

        initFreshChat();
    }, [scriptStatus, token]);

    return {
        isReady,
        widget: window.fcWidget,
    };
};

export default useFreshChat;
