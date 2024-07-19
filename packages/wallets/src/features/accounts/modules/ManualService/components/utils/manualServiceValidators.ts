import * as Yup from 'yup';

export const documentRequiredValidator = (documentType: string) => Yup.string().required(`${documentType} is required`);

export const expiryDateValidator = Yup.date()
    .min(new Date(), 'Expiry date cannot be today date or in the past')
    .required('Expiry date is required');

export const fileValidator = Yup.mixed().required();
