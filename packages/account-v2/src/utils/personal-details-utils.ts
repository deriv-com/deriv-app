import * as Yup from 'yup';

export const getPersonalDetailsBaseValidationSchema = () => {
    const characterLengthMessage = 'You should enter 2-50 characters.';
    const phoneNumberLengthMessage = 'You should enter 9-35 numbers.';

    return Yup.object({
        accountOpeningReason: Yup.string().required('Account opening reason is required.'),
        citizenship: Yup.string().required('Citizenship is required.'),
        countryOfResidence: Yup.string().required('Country of residence is required.'),
        dateOfBirth: Yup.date().typeError('Please enter a valid date.').required('Date of birth is required.'),
        firstName: Yup.string()
            .required('First name is required.')
            .min(2, characterLengthMessage)
            .max(50, characterLengthMessage)
            .matches(/^[a-zA-Z\s\-.']+$/, 'Letters, spaces, periods, hyphens, apostrophes only.'),
        lastName: Yup.string()
            .required('Last Name is required.')
            .min(2, characterLengthMessage)
            .max(50, characterLengthMessage)
            .matches(/^[a-zA-Z\s\-.']+$/, 'Letters, spaces, periods, hyphens, apostrophes only.'),
        nameDOBConfirmation: Yup.boolean().required(),
        phoneNumber: Yup.string()
            .required('Phone number is required.')
            .matches(/^\+?([0-9-]+\s)*[0-9-]+$/, 'Please enter a valid phone number.')
            .min(9, phoneNumberLengthMessage)
            .max(35, phoneNumberLengthMessage),
        placeOfBirth: Yup.string().required('Place of birth is required.'),
        taxIdentificationNumber: Yup.string(),
        taxInfoConfirmation: Yup.boolean().when(['taxIdentificationNumber', 'taxResidence'], {
            is: (taxIdentificationNumber: string, taxResidence: string) => taxIdentificationNumber && taxResidence,
            otherwise: Yup.boolean(),
            then: Yup.boolean()
                .required('Tax info confirmation is required.')
                .oneOf(
                    [true],
                    'You must confirm that the tax identification number and tax residence above are correct and up to date.'
                ),
        }),
        taxResidence: Yup.string().when('taxIdentificationNumber', {
            is: (taxIdentificationNumber: string) => !!taxIdentificationNumber,
            otherwise: Yup.string(),
            then: Yup.string().required('Please fill in tax residence.'),
        }),
    });
};

export const getNameDOBValidationSchema = () => {
    return getPersonalDetailsBaseValidationSchema()
        .pick(['dateOfBirth', 'firstName', 'lastName', 'nameDOBConfirmation'])
        .default(() => ({
            dateOfBirth: '',
            firstName: '',
            lastName: '',
            nameDOBConfirmation: false,
        }));
};
