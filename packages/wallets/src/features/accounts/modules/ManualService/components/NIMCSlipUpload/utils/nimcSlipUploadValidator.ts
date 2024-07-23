import * as Yup from 'yup';
import { selfieUploadValidator } from '../../SelfieUpload/utils';
import { fileValidator } from '../../utils';

export const nimcSlipUploadValidator = Yup.object().shape({
    nimcCardBack: fileValidator,
    nimcCardFront: fileValidator,
    nimcNumber: Yup.string().matches(/^\d{11}$/, 'Please enter your document number. Example: 12345678901'),
    selfieFile: selfieUploadValidator,
});
