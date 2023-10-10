import { useCallback, useMemo } from 'react';
import useQuery from '../useQuery';
import useInvalidateQuery from '../useInvalidateQuery';
import useMutation from '../useMutation';
import { toMoment } from '@deriv/shared';

type TSetSettingsPayload = NonNullable<
    NonNullable<NonNullable<Parameters<ReturnType<typeof useMutation<'set_settings'>>['mutate']>>[0]>['payload']
>;

/** A custom hook to get and update the user settings. */
const useSettings = () => {
    const { data, ...rest } = useQuery('get_settings');
    const { mutate, ...mutate_rest } = useMutation('set_settings', { onSuccess: () => invalidate('get_settings') });
    const invalidate = useInvalidateQuery();

    const update = useCallback((payload: TSetSettingsPayload) => mutate({ payload }), [mutate]);

    // Add additional information to the settings response.
    const modified_settings = useMemo(
        () => ({
            ...data?.get_settings,
            /** Format user's date of birth to YYYY-MM-DD. */
            formatted_date_of_birth: toMoment(data?.get_settings?.date_of_birth).format('YYYY-MM-DD'),
        }),
        [data?.get_settings]
    );

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
