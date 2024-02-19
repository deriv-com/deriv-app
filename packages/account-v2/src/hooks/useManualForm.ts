import { useSettings } from '@deriv/api';

/** A custom hook used for manual verification flow */
const useManualForm = () => {
    const { data: settings } = useSettings();
    const countryCode = settings?.citizen ?? settings?.country_code;
    const isExpiryDateRequired = !!countryCode && countryCode !== 'ng';

    return {
        isExpiryDateRequired,
    };
};

export default useManualForm;
