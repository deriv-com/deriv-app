import React from 'react';
import { useLocation } from 'react-router';

export const useToggleValidation = () => {
    const { hash } = useLocation();
    const [is_validation_enabled, setIsValidationEnabled] = React.useState(false);

    React.useEffect(() => {
        // This effect allows to toggle IDV validation
        // for repetitive and sequential numbers
        if (hash === '#toggle_id_validation') {
            setIsValidationEnabled(true);
        } else {
            setIsValidationEnabled(false);
        }
    }, [hash]);

    return is_validation_enabled;
};
