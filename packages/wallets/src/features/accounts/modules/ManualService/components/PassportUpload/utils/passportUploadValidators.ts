import * as Yup from 'yup';
import { TTranslations } from '../../../../../../../types';
import { selfieUploadValidator } from '../../SelfieUpload/utils';
import { fileValidator, getDocumentNumberValidator, getExpiryDateValidator } from '../../utils';

export const getPassportUploadValidator = (localize: TTranslations['localize']) => {
    return Yup.object().shape({
        passportExpiryDate: getExpiryDateValidator(localize),
        passportFile: fileValidator,
        passportNumber: getDocumentNumberValidator('Passport', localize),
        selfieFile: selfieUploadValidator,
    });
};
