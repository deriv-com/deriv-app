import { useLayoutEffect, useState } from 'react';
import { useScript } from 'usehooks-ts';

const useFreshChat = () => {
    useScript('//uae.fw-cdn.com/40116340/63296.js');
    const [isReady, setIsReady] = useState(false);

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
                window.fcWidget.on('widget:loaded', () => {
                    setIsReady(true);
                });
            },
        };
    };

    useLayoutEffect(() => {
        setDefaultSettings();
    }, []);

    return {
        isReady,
        widget: window.fcWidget,
    };
};

export default useFreshChat;
