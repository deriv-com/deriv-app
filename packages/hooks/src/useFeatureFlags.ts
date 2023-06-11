import { useStore } from '@deriv/stores';

const useFeatureFlags = () => {
    const { feature_flags } = useStore();
    // Safe to do null assertions here as we are setting default values in the store.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const flags = feature_flags.data!;

    const result = Object.keys(flags).reduce(
        (previous, current) => ({
            ...previous,
            // @ts-expect-error current key is always present in the object, Hence can ignore the TS error.
            [`is_${current}_enabled`]: Boolean(flags[current]),
        }),
        {} as Record<`is_${keyof typeof flags}_enabled`, boolean>
    );

    return result;
};
export default useFeatureFlags;
