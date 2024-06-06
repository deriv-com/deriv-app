import { WS } from '@deriv/shared';

type TSetSettings = {
    [key: string]: unknown;
};

const useSetSettings = () => {
    const setSettings = async (value: TSetSettings) => {
        const ws_data = await WS.authorized.setSettings(value);

        return ws_data;
    };

    return {
        setSettings,
    };
};

export default useSetSettings;
