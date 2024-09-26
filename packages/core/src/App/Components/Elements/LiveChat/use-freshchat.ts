import { useLayoutEffect, useState } from 'react';
import { useIsMounted } from 'usehooks-ts';

const useFreshChat = () => {
    const [isReady, setIsReady] = useState(false);
    const isMounted = useIsMounted();

    useLayoutEffect(() => {
        if (isMounted() && window.fcWidget?.isLoaded()) {
            setIsReady(true);
        }
    }, [isMounted]);

    return {
        isReady,
        widget: window.fcWidget,
    };
};

export default useFreshChat;
