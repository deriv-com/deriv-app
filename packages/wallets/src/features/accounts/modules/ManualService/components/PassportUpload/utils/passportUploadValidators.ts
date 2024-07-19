import * as Yup from 'yup';
import { selfieUploadValidator } from '../../SelfieUpload/utils';
import { expiryDateValidator, fileValidator } from '../../utils';

export const passportUploadValidator = Yup.object().shape({
    passportExpiryDate: expiryDateValidator,
    passportFile: fileValidator,
    passportNumber: Yup.string()
        .matches(/^[A-Z]\d{7}$/, 'Please enter the correct format. Example: G1234567')
        .max(8)
        .required('Please enter your Passport number. Example: G1234567'),
    selfieFile: selfieUploadValidator,
});
