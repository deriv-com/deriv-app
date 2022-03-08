import React, { useState } from 'react';
import ProofOfOwnershipForm from './proof-of-ownership-form.jsx';
import POOSubmitted from 'Components/poo-submitted';

// const CARDS_COUNT = 10;
// const CARD_VALUE = {
//     static_data: {
//         cardTitle: '',
//         icon: 'IcCreditCard',
//     },
//     data: {
//         cardNumber: '',
//         file: null,
//     },
// };

// TODO: get real ownership object from get_account_status call
const ownership = {
    requests: [
        {
            creation_time: '3 o clock',
            id: 'abc1234',
            payment_method: 'E-wallet',
            payment_method_identifier: 'e_wallet',
        },
        {
            creation_time: '4 o clock',
            id: 'abc1235',
            payment_method: 'ZingPay',
            payment_method_identifier: 'zingPay',
        },
        {
            creation_time: '5 o clock',
            id: 'abc1236',
            payment_method: 'OnlineNaira',
            payment_method_identifier: 'online_naira',
        },
        {
            creation_time: '6 o clock',
            id: 'abc1237',
            payment_method: 'Beyonic',
            payment_method_identifier: 'beyonic',
        },
        {
            creation_time: '7 o clock',
            id: 'abc1238',
            payment_method: 'Bank Transfer/Bank Wire ',
            payment_method_identifier: 'bank_transfer',
        },
        {
            creation_time: '8 o clock',
            id: 'abc1239',
            payment_method: '[Payment method name]',
            payment_method_identifier: 'other',
        },
        {
            creation_time: '9 o clock',
            id: 'abc12340',
            payment_method: 'Credit / Debit card',
            payment_method_identifier: 'credit_debit_card',
        },
    ],
    status: 'pending',
};

const ProofOfOwnership = () => {
    const [cards] = useState(ownership.requests);
    const [status] = useState(ownership.status);
    const [step, setStep] = useState(0);

    const handleSubmit = e => {
        // eslint-disable-next-line no-console
        console.log('hello', e);
    };
    const nextStep = () => {
        setStep(step + 1);
    };
    if (status === 'pending' && cards.length) {
        return (
            <ProofOfOwnershipForm
                // cards_count={CARDS_COUNT}
                // cards_value={CARD_VALUE}
                cards={cards}
                handleSubmit={handleSubmit}
                nextStep={nextStep}
            />
        );
    }
    // TODO: add screen for approved POO (status === 'none')
    if (status === 'none') {
        return null;
    }
    return <POOSubmitted />;
};

export default ProofOfOwnership;
