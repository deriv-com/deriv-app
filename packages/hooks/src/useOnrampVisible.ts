import { useStore } from '@deriv/stores';

const useOnrampVisible = () => {
    const { client } = useStore();
    const { website_status, currency, is_virtual } = client;

    const is_onramp_visible =
        !is_virtual &&
        !!website_status?.currencies_config?.[currency] &&
        //@ts-expect-error need to update `@deriv/api-types` library to the latest version
        website_status?.currencies_config?.[currency].platform.ramp.length > 0;

    return is_onramp_visible;
};

export default useOnrampVisible;
