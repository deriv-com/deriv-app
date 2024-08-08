import * as Yup from 'yup';
import { TTranslations } from '../../../../../../../types';
import { selfieUploadValidator } from '../../SelfieUpload/utils';
import { fileValidator, getDocumentNumberValidator, getExpiryDateValidator } from '../../utils';

export const getDrivingLicenseUploadValidator = (localize: TTranslations['localize']) =>
    Yup.object().shape({
        drivingLicenseCardBack: fileValidator,
        drivingLicenseCardFront: fileValidator,
        drivingLicenseExpiryDate: getExpiryDateValidator(localize),
        drivingLicenseNumber: getDocumentNumberValidator('Driving license', localize),
        selfieFile: selfieUploadValidator,
    });
