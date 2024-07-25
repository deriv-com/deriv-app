import * as Yup from 'yup';
import { TCountryList } from './constants';

export const getTinValidator = (pattern: string) => {
    if (pattern && pattern.length > 0) {
        return Yup.string()
            .required('Please fill in Tax identification number.')
            .matches(new RegExp(pattern), 'The format is incorrect.');
    }
    return Yup.string().required('Please fill in Tax identification number.');
};

export const getTaxResidenceValidator = (countryList: TCountryList) => {
    return Yup.string()
        .required('Tax residence is required.')
        .test({
            name: 'test-tax-residence',
            test: (value, context) => {
                const countryFound =
                    value && countryList.find(country => country.text.toLowerCase() === value.toLowerCase());
                if (!countryFound) {
                    return context.createError({ message: 'Please enter a valid country.' });
                }
                return true;
            },
        });
};

export const taxInformationValidationSchema = Yup.object().shape({
    accountOpeningReason: Yup.string().required('Account opening reason is required.'),
    citizenship: Yup.string().required('Citizenship is required.'),
    placeOfBirth: Yup.string().required('Place of birth is required.'),
});
