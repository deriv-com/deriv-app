import { useCallback, useMemo } from 'react';
import useAuthorize from './useAuthorize';
import useQuery from '../useQuery';
import useInvalidateQuery from '../useInvalidateQuery';
import useMutation from '../useMutation';

type TSetSettingsPayload = NonNullable<
    NonNullable<NonNullable<Parameters<ReturnType<typeof useMutation<'set_settings'>>['mutate']>>[0]>['payload']
>;

/** A custom hook to get and update the user settings. */
const useSettings = () => {
    const { isSuccess } = useAuthorize();
    const { data, ...rest } = useQuery('get_settings', { options: { enabled: isSuccess } });
    const { mutate, ...mutate_rest } = useMutation('set_settings', { onSuccess: () => invalidate('get_settings') });
    const invalidate = useInvalidateQuery();

    const update = useCallback((payload: TSetSettingsPayload) => mutate({ payload }), [mutate]);

    // Add additional information to the settings response.
    const modified_settings = useMemo(() => {
        const citizenship = data?.get_settings?.citizen ?? '';
        const account = data?.get_settings?.account_opening_reason ?? '';
        const placeofbirth = data?.get_settings?.place_of_birth ?? '';
        const taxResidence = data?.get_settings?.tax_residence ?? '';
        const taxIdentificationnumber = data?.get_settings?.tax_identification_number ?? '';

        return {
            ...data?.get_settings,
            has_submitted_personal_details: Boolean(
                citizenship && account && placeofbirth && taxResidence && taxIdentificationnumber
            ),
        };
    }, [data?.get_settings]);

    return {
        /** The settings response. */
        data: modified_settings,
        /** Function to update user settings */
        update,
        /** The mutation related information */
        mutation: mutate_rest,
        ...rest,
    };
};

export default useSettings;
