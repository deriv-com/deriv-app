import { useMemo } from 'react';
import { useStore } from '@deriv/stores';

const useFeatureFlags = () => {
    const { feature_flags } = useStore();

    const result = useMemo(() => {
        const flags = feature_flags.data ?? {};

        return Object.keys(flags).reduce(
            (previous, current) => ({
                ...previous,
                // @ts-expect-error current key is always present in the object, Hence can ignore the TS error.
                [`is_${current}_enabled`]: Boolean(flags[current]),
            }),
            {} as Record<`is_${keyof typeof flags}_enabled`, boolean>
        );
    }, [feature_flags.data]);

    return result;
};
export default useFeatureFlags;
