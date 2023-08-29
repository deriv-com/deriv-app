import { useCallback, useMemo } from 'react';
import useFetch from '../useFetch';
import useInvalidateQuery from '../useInvalidateQuery';
import useRequest from '../useRequest';

type TSetSettingsPayload = NonNullable<
    NonNullable<NonNullable<Parameters<ReturnType<typeof useRequest<'set_settings'>>['mutate']>>[0]>['payload']
>;

/** A custom hook to get user settings (email, date of birth, address etc) */
const useSettings = () => {
    const { data, ...rest } = useFetch('get_settings');
    const invalidate = useInvalidateQuery();
    const { mutate, ...mutate_rest } = useRequest('set_settings', {
        onSuccess: () => invalidate('get_settings'),
    });

    const update = useCallback((values: TSetSettingsPayload) => mutate({ payload: { ...values } }), [mutate]);

    const modified_data = useMemo(() => ({ ...data?.get_settings }), [data?.get_settings]);

    return {
        /** User information and settings */
        data: modified_data,
        /** Function to update user settings */
        update,
        mutation: mutate_rest,
        ...rest,
    };
};

export default useSettings;
