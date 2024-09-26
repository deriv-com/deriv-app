import { useLayoutEffect, useState } from 'react';

const useFreshChat = () => {
    const [isReady, setIsReady] = useState(false);

    const setDefaultSettings = () => {
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
