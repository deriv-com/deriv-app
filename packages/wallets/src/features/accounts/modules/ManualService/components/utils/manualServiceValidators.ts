import moment from 'moment';
import * as Yup from 'yup';
import { localize } from '@deriv-com/translations';

export const documentRequiredValidator = (documentType: string) =>
    Yup.string().required(localize('{{type}} is required', { type: documentType }));

export const expiryDateValidator = Yup.string()
    .nullable()
    .required(localize('Expiry date is required.'))
    .test({
        name: 'test-expiry-date-is-null',
        test: (value, context) => {
            if (value === null) {
                return context.createError({ message: localize('Expiry date is required.') });
            }
            return true;
        },
    })
    .test({
        name: 'test-min-expiry-date',
        test: (value, context) => {
            if (moment(value).isBefore(new Date())) {
                return context.createError({ message: localize('Expiry date cannot be today date or in the past') });
            }
            return true;
        },
    });

export const fileValidator = Yup.mixed().required();
