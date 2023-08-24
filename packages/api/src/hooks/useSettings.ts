import { useCallback, useEffect, useMemo } from 'react';
import useFetch from '../useFetch';
import useInvalidateQuery from '../useInvalidateQuery';
import useRequest from '../useRequest';

type TSetSettingsPayload = NonNullable<
    NonNullable<Parameters<ReturnType<typeof useRequest<'set_settings'>>['mutate']>>[0]
>['payload'];

/** A custom hook to get user settings (email, date of birth, address etc) */
const useSettings = () => {
    const { data, ...rest } = useFetch('get_settings');
    const invalidate = useInvalidateQuery();
    const { mutate } = useRequest('set_settings', {
        onSuccess: () => invalidate('get_settings'),
    });

    const set_settings = useCallback(
        (values: NonNullable<TSetSettingsPayload>) => mutate({ payload: { ...values } }),
        [mutate]
    );

    const modified_data = useMemo(() => ({ ...data?.get_settings }), [data?.get_settings]);

    return {
        /** User information and settings */
        data: modified_data,
        /** Function to update user settings */
        set_settings,
        ...rest,
    };
};

export default useSettings;
