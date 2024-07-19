import * as Yup from 'yup';
import { selfieUploadValidator } from '../../SelfieUpload/utils';
import { expiryDateValidator, fileValidator } from '../../utils';

export const identityCardUploadValidator = Yup.object().shape({
    identityCardBack: fileValidator,
    identityCardExpiryDate: expiryDateValidator,
    identityCardFront: fileValidator,
    identityCardNumber: Yup.string().required(),
    selfieFile: selfieUploadValidator,
});
