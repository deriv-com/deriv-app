import * as Yup from 'yup';

export const drivingLicenseValidator = Yup.string()
    .matches(/^[A-Z]\d{7}$/, 'Please enter the correct format. Example: B1234567')
    .max(8)
    .required('Please enter your Driver License number. Example: B1234567');

export const passportValidator = Yup.string()
    .matches(/^[A-Z]\d{7}$/, 'Please enter the correct format. Example: G1234567')
    .max(8)
    .required('Please enter your Passport number. Example: G1234567');

export const documentRequiredValidator = (documentType: string) => Yup.string().required(`${documentType} is required`);

export const ssnitValidator = Yup.string()
    .matches(/^[A-Z]\d{12}$/, 'Please enter the correct format. Example: C123456789012')
    .max(13)
    .required('Please enter your SSNIT number. Example: C123456789012');

export const nimcSlipValidator = Yup.string().matches(
    /^\d{11}$/,
    'Please enter your document number. Example: 12345678901'
);

export const requiredValidator = Yup.string().required('This field is required');

export const dateOfBirthValidator = Yup.date().required('Please enter your date of birth');

export const expiryDateValidator = Yup.date()
    .min(new Date(), 'Expiry date cannot be today date or in the past')
    .required('Expiry date is required');

export const firstNameValidator = Yup.string().required('Please enter your first name');

export const lastNameValidator = Yup.string().required('Please enter your last name');

export const letterRequiredValidator = Yup.string()
    .matches(/^[a-zA-Z\s\-.'']+$/, 'Only letters, space, hyphen, period, and apostrophe are allowed.')
    .required('This field is required');
