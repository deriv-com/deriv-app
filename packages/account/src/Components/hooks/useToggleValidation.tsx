import React from 'react';

export const useToggleValidation = (hash: string) => {
    const [is_validation_enabled, setIsValidationEnabled] = React.useState(false);

    React.useEffect(() => {
        // This effect allows to toggle IDV validation
        // for repetitive and sequential numbers
        if (hash && hash === '#toggle_id_validation') {
            setIsValidationEnabled(true);
        } else {
            setIsValidationEnabled(false);
        }
    }, [hash]);

    return is_validation_enabled;
};
