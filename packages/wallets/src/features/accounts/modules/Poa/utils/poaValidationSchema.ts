import * as Yup from 'yup';
import { fileValidator } from '../../ManualService/components/utils';

export const poaValidationSchema = Yup.object().shape({
    firstLine: Yup.string()
        .trim()
        .required('First line of address is required.')
        .max(70, 'Should be less than 70.')
        .matches(
            /^[\p{L}\p{Nd}\s'.,:;()\u00b0@#/-]{0,70}$/u,
            "Use only the following special characters: . , ' : ; ( ) ° @ # / -'"
        ),
    poaFile: fileValidator,
    secondLine: Yup.string()
        .trim()
        .max(70, 'Should be less than 70.')
        .matches(
            /^[\p{L}\p{Nd}\s'.,:;()\u00b0@#/-]{0,70}$/u,
            "Use only the following special characters: . , ' : ; ( ) ° @ # / -'"
        ),
    townCityLine: Yup.string()
        .required('Town/City is required.')
        .max(70, 'Should be less than 70.')
        .matches(/^[a-zA-Z\s\-.']+$/, 'Only letters, space, hyphen, period, and apostrophe are allowed.'),
    zipCodeLine: Yup.string()
        .max(20, 'Please enter a Postal/ZIP code under 20 characters.')
        .matches(/^[A-Za-z0-9][A-Za-z0-9\s-]*$/, 'Only letters, numbers, space, and hyphen are allowed.'),
});
