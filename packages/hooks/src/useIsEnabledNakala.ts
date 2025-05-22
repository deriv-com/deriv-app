import useGrowthbookGetFeatureValue from './useGrowthbookGetFeatureValue';

const useIsEnabledNakala = () => {
    const [is_nakala_enabled] = useGrowthbookGetFeatureValue({
        featureFlag: 'is_nakala_enabled',
    });

    return { IsEnabledNakala: is_nakala_enabled };
};

export default useIsEnabledNakala;
