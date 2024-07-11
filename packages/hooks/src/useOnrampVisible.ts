import { useStore } from '@deriv-lib/stores';

const useOnrampVisible = () => {
    const { client } = useStore();
    const { is_virtual, is_crypto } = client;
    const is_onramp_visible = !is_virtual && is_crypto();

    return is_onramp_visible;
};

export default useOnrampVisible;
