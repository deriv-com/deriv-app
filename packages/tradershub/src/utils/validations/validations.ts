import * as Yup from 'yup';

export const personalDetails = Yup.object().shape({
    accountOpeningReason: Yup.string().required('Account opening reason is required'),
    dateOfBirth: Yup.date().typeError('Please enter a valid date').required('Date of birth is required.'),
    firstName: Yup.string()
        .required('First name is required.')
        .matches(/^[a-zA-Z\s\-.'']+$/, 'Letters, spaces, periods, hyphens, apostrophes only.')
        .min(2, 'You should enter 2-50 characters.')
        .max(50, 'You should enter 2-50 characters.'),
    lastName: Yup.string()
        .required('Last Name is required.')
        .matches(/^[a-zA-Z\s\-.'']+$/, 'Letters, spaces, periods, hyphens, apostrophes only.')
        .min(2, 'You should enter 2-50 characters.')
        .max(50, 'You should enter 2-50 characters.'),
    phoneNumber: Yup.string()
        .matches(/^\+?([0-9-]+\s)*[0-9-]+$/, 'Please enter a valid phone number')
        .required('Phone number is required'),
    placeOfBirth: Yup.string().required('Place of birth is required'),
    taxIdentificationNumber: Yup.string(),
    taxResidence: Yup.string(),
});

export const address = Yup.object().shape({
    firstLineAddress: Yup.string().required('First line of address is required'),
    secondLineAddress: Yup.string(),
    stateProvince: Yup.string(),
    townCity: Yup.string().required('Town/City is required'),
    zipCode: Yup.string().matches(/^[A-Za-z0-9][A-Za-z0-9\s-]*$/, 'Please enter a valid postal/ZIP code'),
});
