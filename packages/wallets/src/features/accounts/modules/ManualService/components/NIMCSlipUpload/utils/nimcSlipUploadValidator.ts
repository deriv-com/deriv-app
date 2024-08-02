import * as Yup from 'yup';
import { TTranslations } from '../../../../../../../types';
import { selfieUploadValidator } from '../../SelfieUpload/utils';
import { fileValidator } from '../../utils';

export const getNimcSlipUploadValidator = (localize: TTranslations['localize']) =>
    Yup.object().shape({
        nimcCardBack: fileValidator,
        nimcCardFront: fileValidator,
        nimcNumber: Yup.string().matches(
            /^\d{11}$/,
            localize('Please enter your document number. Example: 12345678901')
        ),
        selfieFile: selfieUploadValidator,
    });
