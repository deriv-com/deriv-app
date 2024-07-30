import * as Yup from 'yup';

export const validateArePersonalDetailsVerified = (value: boolean) => {
    if (!value) return 'Please verify personal details to proceed.';
};

export const dateOfBirthValidator = Yup.date().required('Please enter your date of birth');

export const firstNameValidator = Yup.string()
    .required('This field is required')
    .matches(/^[a-zA-Z\s\-.']+$/, 'Letters, spaces, periods, hyphens, apostrophes only.')
    .min(1, 'Name must have at least 1 character.')
    .max(50, 'Enter no more than 50 characters.');

export const lastNameValidator = Yup.string()
    .required('This field is required')
    .matches(/^[a-zA-Z\s\-.']+$/, 'Letters, spaces, periods, hyphens, apostrophes only.')
    .min(1, 'Name must have at least 1 character.')
    .max(50, 'Enter no more than 50 characters.');
