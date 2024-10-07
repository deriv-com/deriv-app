import { useStore } from '@deriv/stores';
import { useEffect, useState } from 'react';
import { useScript } from 'usehooks-ts';

const useFreshChat = () => {
    const scriptStatus = useScript('https://static.deriv.com/scripts/freshchat.js');
    const [isReady, setIsReady] = useState(false);

    const { client } = useStore();
    const { loginid, accounts } = client;
    const active_account = accounts?.[loginid ?? ''];
    const token = active_account ? active_account.token : null;

    useEffect(() => {
        const initFreshChat = async () => {
            if (scriptStatus === 'ready') {
                if (window.FreshChat && window.fcSettings) {
                    window.FreshChat.initialize({
                        token,
                        locale: 'en',
                        hideButton: true,
                    });
                }
            }
        };
        initFreshChat();
    }, [scriptStatus, token]);

    useEffect(() => {
        const checkFcWidget = () => {
            if (typeof window !== 'undefined' && window.fcWidget) {
                window.fcWidget.on('widget:loaded', () => {
                    // eslint-disable-next-line no-console
                    console.log('fc widget loaded');
                    setIsReady(true);
                });
            } else {
                setIsReady(false);
            }
        };

        checkFcWidget();

        const intervalId = setInterval(checkFcWidget, 1000);

        return () => clearInterval(intervalId);
    }, []);

    return {
        isReady,
        widget: window.fcWidget,
    };
};

export default useFreshChat;
