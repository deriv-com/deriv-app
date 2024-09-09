import { useStore } from '@deriv/stores';
import { useEffect, useState } from 'react';
import { useScript } from 'usehooks-ts';

const useFreshChat = () => {
    useScript('https://fw-cdn.com/11706964/4344125.js');

    const [isReady, setIsReady] = useState(false);
    const { client } = useStore();
    const { getFreshworksToken, is_logged_in } = client;

    const setDefaultSettings = () => {
        window.fcWidgetMessengerConfig = {
            config: {
                headerProperty: {
                    hideChatButton: true,
                },
            },
        };

        window.fcSettings = {
            onInit() {
                window.fcWidget.on('widget:loaded', async () => {
                    setIsReady(true);
                    if (is_logged_in) {
                        const token = await getFreshworksToken();
                        window.fcWidget.authenticate(token);
                        // window.fcWidget.user.setProperties({ cf_user_jwt: token });
                    }
                });
            },
        };
    };

    useEffect(() => {
        setDefaultSettings();
    }, []);

    return {
        isReady,
        widget: window.fcWidget,
    };
};

export default useFreshChat;
