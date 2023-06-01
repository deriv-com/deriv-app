import { useStore } from '@deriv/stores';

const useFeatureFlags = () => {
    const { feature_flags } = useStore();
    // Safe to do null assertions here as we are setting default values in the store.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const flags = feature_flags.data!;

    const result = Object.keys(flags)
        // @ts-expect-error flag key is always present in the object, Hence can ignore the TS error.
        .map(flag => ({ [`is_${flag}_enabled`]: Boolean(flags[flag]) }))
        .reduce((previous, current) => ({ ...previous, ...current }), {});

    return result as Record<`is_${keyof typeof flags}_enabled`, boolean>;
};
export default useFeatureFlags;
