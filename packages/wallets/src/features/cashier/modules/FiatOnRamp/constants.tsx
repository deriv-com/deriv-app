import React from 'react';
import IcCashierApplePay from '../../../../public/images/ic-cashier-apple-pay.svg';
import IcCashierBanxa from '../../../../public/images/ic-cashier-banxa.svg';
import IcCashierMastercard from '../../../../public/images/ic-cashier-mastercard.svg';
import IcCashierVisa from '../../../../public/images/ic-cashier-visa.svg';

export const fiatOnRampProvider = {
    description:
        'A fast and secure fiat-to-crypto payment service. Deposit cryptocurrencies from anywhere in the world using your credit/debit cards and bank transfers.',
    getPaymentIcons: () => [
        {
            icon: <IcCashierApplePay />,
            name: 'apple-pay',
        },
        {
            icon: <IcCashierMastercard />,
            name: 'mastercard',
        },
        {
            icon: <IcCashierVisa />,
            name: 'visa',
        },
    ],
    icon: <IcCashierBanxa key='banxa' />,
    name: 'Banxa',
};
