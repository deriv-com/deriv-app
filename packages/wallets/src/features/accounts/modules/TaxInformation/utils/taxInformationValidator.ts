import * as Yup from 'yup';

export const getTinValidator = (pattern: string) => {
    if (pattern) {
        return Yup.string()
            .required('Please fill in Tax identification number.')
            .matches(new RegExp(pattern), 'The format is incorrect.')
            .nullable(false);
    }
};

export const taxInformationValidationSchema = Yup.object().shape({
    accountOpeningReason: Yup.string().required('Account opening reason is required.'),
    citizenship: Yup.string().required('Citizenship is required.'),
    placeOfBirth: Yup.string().required('Place of birth is required.'),
    taxResidence: Yup.string().required('Tax residence is required.').nullable(false),
});
