import * as Yup from 'yup';
import { TTranslations } from '../../../../../../../types';
import { selfieUploadValidator } from '../../SelfieUpload/utils';
import { expiryDateValidator, fileValidator } from '../../utils';

export const getPassportUploadValidator = (localize: TTranslations['localize']) => {
    return Yup.object().shape({
        passportExpiryDate: expiryDateValidator,
        passportFile: fileValidator,
        passportNumber: Yup.string()
            .matches(/^[A-Z]\d{7}$/, localize('Please enter the correct format. Example: G1234567'))
            .max(8)
            .required(localize('Please enter your Passport number. Example: G1234567')),
        selfieFile: selfieUploadValidator,
    });
};
