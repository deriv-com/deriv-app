import * as Yup from 'yup';
import { localize } from '@deriv-com/translations';

export const getTinValidator = (pattern: string) => {
    if (pattern && pattern.length > 0) {
        return Yup.string()
            .required(localize('Please fill in Tax identification number.'))
            .matches(new RegExp(pattern), localize('The format is incorrect.'));
    }
    return Yup.string().required(localize('Please fill in Tax identification number.'));
};

export const getTaxResidenceValidator = (countryList: Record<string, string>[]) => {
    return Yup.string()
        .required(localize('Tax residence is required.'))
        .test({
            name: 'test-tax-residence',
            test: (value, context) => {
                const countryFound = value && countryList.find(country => country.value.toLowerCase() === value);
                if (!countryFound) {
                    return context.createError({ message: localize('Please enter a valid country.') });
                }
                return true;
            },
        });
};

export const taxInformationValidationSchema = Yup.object().shape({
    accountOpeningReason: Yup.string().required(localize('Account opening reason is required.')),
    citizenship: Yup.string().required(localize('Citizenship is required.')),
    placeOfBirth: Yup.string().required(localize('Place of birth is required.')),
});
