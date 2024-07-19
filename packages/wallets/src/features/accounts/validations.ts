import * as Yup from 'yup';

export const drivingLicenseValidator = Yup.string()
    .matches(/^[A-Z]\d{7}$/, 'Please enter the correct format. Example: B1234567')
    .max(8)
    .required('Please enter your Driver License number. Example: B1234567');

export const ssnitValidator = Yup.string()
    .matches(/^[A-Z]\d{12}$/, 'Please enter the correct format. Example: C123456789012')
    .max(13)
    .required('Please enter your SSNIT number. Example: C123456789012');

export const requiredValidator = Yup.string().required('This field is required');
