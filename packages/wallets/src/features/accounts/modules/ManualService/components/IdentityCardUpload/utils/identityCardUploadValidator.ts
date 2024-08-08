import * as Yup from 'yup';
import { TTranslations } from '../../../../../../../types';
import { selfieUploadValidator } from '../../SelfieUpload/utils';
import { fileValidator, getDocumentNumberValidator, getExpiryDateValidator } from '../../utils';

export const getIdentityCardUploadValidator = (localize: TTranslations['localize']) =>
    Yup.object().shape({
        identityCardBack: fileValidator,
        identityCardExpiryDate: getExpiryDateValidator(localize),
        identityCardFront: fileValidator,
        identityCardNumber: getDocumentNumberValidator('Identity card', localize),
        selfieFile: selfieUploadValidator,
    });
