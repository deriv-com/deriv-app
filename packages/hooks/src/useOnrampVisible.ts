import { useStore } from '@deriv/stores';

const useOnrampVisible = () => {
    const { client } = useStore();
    const { website_status, currency, is_virtual } = client;

    //@ts-expect-error need to update `@deriv/api-types` library to the latest version
    const is_onramp_visible = !is_virtual && website_status?.currencies_config?.[currency].platform.ramp.length > 0;

    return is_onramp_visible;
};

export default useOnrampVisible;
