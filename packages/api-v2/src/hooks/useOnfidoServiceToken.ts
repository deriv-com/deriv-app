import { ALPHA_3_TO_ALPHA_2 } from '../constants';
import useQuery from '../useQuery';
import useSettings from './useSettings';

// TODO: Merge service token hooks into a single service token hook call
/** A custom hook that get Service Token for Onfido.
 * @param [country] - The country code to be used to retrieve the Onfido service token.
 * For example:
 * ```
 * const { data: { token } } = useOnfidoServiceToken()
 * ```
 */

const useOnfidoServiceToken = (country?: string) => {
    const { data: settings } = useSettings();
    const country_code = country ?? settings.country_code ?? '';
    const countryCode = country_code.length >= 3 ? ALPHA_3_TO_ALPHA_2[country_code] : country_code;
    const { data: onfido_token_data, ...rest } = useQuery('service_token', {
        payload: {
            service: 'onfido',
            country: countryCode,
        },
        options: {
            retry: 3,
            enabled: !!countryCode,
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
