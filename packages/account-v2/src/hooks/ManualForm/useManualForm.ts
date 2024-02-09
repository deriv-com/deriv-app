import { useSettings } from '@deriv/api';

/** A custom hook used for manual verification flow */
const useManualForm = () => {
    const { data: settings, ...rest } = useSettings();
    const isExpiryDateRequired = settings?.country !== 'ng';

    return {
        isExpiryDateRequired,
        ...rest,
    };
};

export default useManualForm;
