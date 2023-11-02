import { ALPHA_3_TO_ALPHA_2 } from '../constants';
import useQuery from '../useQuery';
import useSettings from './useSettings';

// TODO: Merge service token hooks into a single service token hook call
/** A custom hook that get Service Token for Onfido. */
const useOnfidoServiceToken = () => {
    const { data: settings, isSuccess } = useSettings();
    const { data: onfido_token_data, ...rest } = useQuery('service_token', {
        payload: {
            service: 'onfido',
            country: settings?.country_code
                ? settings?.country_code?.length >= 3
                    ? ALPHA_3_TO_ALPHA_2[settings?.country_code]
                    : settings?.country_code
                : '',
        },
        options: {
            enabled: isSuccess,
        },
    });

    return {
        /** return the onfido account token */
        data: {
            ...onfido_token_data?.service_token?.onfido,
        },
        ...rest,
    };
};

export default useOnfidoServiceToken;
