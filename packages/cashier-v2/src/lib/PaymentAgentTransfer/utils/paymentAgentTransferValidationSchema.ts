import * as Yup from 'yup';
import type { TCurrency } from '../../../types';
import {
    betweenMinAndMaxValidator,
    decimalsValidator,
    descriptionValidator,
    insufficientBalanceValidator,
    numberValidator,
} from '../../../utils';

type TGetPaymentAgentTransferValidationSchema = {
    balance: number;
    currency: TCurrency;
    fractionalDigits: number;
    limits: {
        max?: number;
        min?: number;
    };
};

export const getPaymentAgentTransferValidationSchema = ({
    balance,
    currency,
    fractionalDigits,
    limits,
}: TGetPaymentAgentTransferValidationSchema) => {
    return Yup.object().shape({
        amount: Yup.string()
            .required('This field is required.')
            .test({
                name: 'test-valid-number',
                test: (value = '', context) => numberValidator(value, context),
            })
            .test({
                name: 'test-decimals',
                test: (value = '', context) => decimalsValidator(value, context, fractionalDigits),
            })
            .test({
                name: 'test-insufficient-balance',
                test: (value = '', context) => insufficientBalanceValidator(value, context, balance),
            })
            .test({
                name: 'test-between-min-max',
                test: (value = '', context) => betweenMinAndMaxValidator(value, context, { currency, limits }),
            }),
        description: Yup.string().test({
            name: 'test-description',
            test: (value = '', context) => descriptionValidator(value, context),
        }),
        loginid: Yup.string()
            .required('This field is required.')
            .matches(/^[A-Za-z]+\d+$/, 'Please enter a valid client login ID.'),
    });
};
