import * as Yup from 'yup';
import { localize } from '@deriv-com/translations';

export const validateArePersonalDetailsVerified = (value: boolean) => {
    if (!value) return localize('Please verify personal details to proceed.');
};

export const dateOfBirthValidator = Yup.date().required(localize('Please enter your date of birth'));

export const firstNameValidator = Yup.string()
    .required(localize('This field is required'))
    .matches(/^[a-zA-Z\s\-.']+$/, localize('Letters, spaces, periods, hyphens, apostrophes only.'))
    .min(1, localize('First name must have at least 1 character.'))
    .max(50, localize('Enter no more than 50 characters.'));

export const lastNameValidator = Yup.string()
    .required(localize('This field is required'))
    .matches(/^[a-zA-Z\s\-.']+$/, localize('Letters, spaces, periods, hyphens, apostrophes only.'))
    .min(1, localize('Last name must have at least 1 character.'))
    .max(50, localize('Enter no more than 50 characters.'));
