import moment from 'moment';
import * as Yup from 'yup';

export const documentRequiredValidator = (documentType: string) => Yup.string().required(`${documentType} is required`);

export const expiryDateValidator = Yup.string()
    .nullable()
    .required('Expiry date is required.')
    .test({
        name: 'test-expiry-date-is-null',
        test: (value, context) => {
            if (value === null) {
                return context.createError({ message: 'Expiry date is required.' });
            }
            return true;
        },
    })
    .test({
        name: 'test-min-expiry-date',
        test: (value, context) => {
            if (moment(value).isBefore(new Date())) {
                return context.createError({ message: 'Expiry date cannot be today date or in the past' });
            }
            return true;
        },
    });

export const fileValidator = Yup.mixed().required();
