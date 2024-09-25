import { useEffect, useState } from 'react';
import { useIsMounted } from 'usehooks-ts';

const useFreshChat = () => {
    const [isReady, setIsReady] = useState(false);
    const isMounted = useIsMounted();

    const setDefaultSettings = () => {
        window.fcWidgetMessengerConfig = {
            config: {
                headerProperty: {
                    hideChatButton: true,
                },
            },
        };
    };

    useEffect(() => {
        setDefaultSettings();
    }, []);

    useEffect(() => {
        if (isMounted() && window.fcWidget?.isLoaded()) {
            setIsReady(true);
        }
    }, [isMounted, window.fcWidget]);

    return {
        isReady,
        widget: window.fcWidget,
    };
};

export default useFreshChat;
