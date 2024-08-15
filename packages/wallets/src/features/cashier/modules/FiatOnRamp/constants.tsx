import React from 'react';
import {
    PaymentMethodApplePayBrandIcon,
    PaymentMethodBanxaBrandIcon,
    PaymentMethodMastercardBrandIcon,
    PaymentMethodVisaBrandIcon,
} from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';

export const fiatOnRampProvider = {
    description: (
        <Localize i18n_default_text='A fast and secure fiat-to-crypto payment service. Deposit cryptocurrencies from anywhere in the world using your credit/debit cards and bank transfers.' />
    ),
    getPaymentIcons: () => [
        {
            icon: <PaymentMethodApplePayBrandIcon />,
            name: 'apple-pay',
        },
        {
            icon: <PaymentMethodMastercardBrandIcon />,
            name: 'mastercard',
        },
        {
            icon: <PaymentMethodVisaBrandIcon />,
            name: 'visa',
        },
    ],
    icon: <PaymentMethodBanxaBrandIcon key='banxa' />,
    name: <Localize i18n_default_text='Banxa' />,
};
