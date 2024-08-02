import * as Yup from 'yup';
import { TTranslations } from '../../../../../../../types';
import { selfieUploadValidator } from '../../SelfieUpload/utils';
import { expiryDateValidator, fileValidator } from '../../utils';

export const getIdentityCardUploadValidator = (localize: TTranslations['localize']) =>
    Yup.object().shape({
        identityCardBack: fileValidator,
        identityCardExpiryDate: expiryDateValidator,
        identityCardFront: fileValidator,
        identityCardNumber: Yup.string().required(localize('Identity card number is required.')),
        selfieFile: selfieUploadValidator,
    });
