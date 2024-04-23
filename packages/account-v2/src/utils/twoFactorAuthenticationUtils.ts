import * as Yup from 'yup';
import { ValidationConstants } from '@deriv-com/utils';

export const getTwoFactorAuthenticationFormValidationSchema = () => {
    return Yup.object({
        digitCode: Yup.string()
            .required('Digit code is required.')
            .length(6, 'Length of digit code must be 6 characters.')
            .matches(ValidationConstants.patterns.integer, 'Digit code must only contain numbers.'),
    });
};
