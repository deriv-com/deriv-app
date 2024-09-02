import * as Yup from 'yup';
import { TTranslations } from '../../../../../../../types';

export const getValidateArePersonalDetailsVerified = (value: boolean, localize: TTranslations['localize']) => {
    if (value === false) return localize('Please verify personal details to proceed.');
};

export const getDateOfBirthValidator = (localize: TTranslations['localize']) =>
    Yup.date().required(localize('Please enter your date of birth'));

export const getFirstNameValidator = (localize: TTranslations['localize']) =>
    Yup.string()
        .required(localize('This field is required'))
        .matches(/^[a-zA-Z\s\-.']+$/, localize('Letters, spaces, periods, hyphens, apostrophes only.'))
        .min(1, localize('First name must have at least 1 character.'))
        .max(50, localize('Enter no more than 50 characters.'));

export const getLastNameValidator = (localize: TTranslations['localize']) =>
    Yup.string()
        .required(localize('This field is required'))
        .matches(/^[a-zA-Z\s\-.']+$/, localize('Letters, spaces, periods, hyphens, apostrophes only.'))
        .min(1, localize('Last name must have at least 1 character.'))
        .max(50, localize('Enter no more than 50 characters.'));
