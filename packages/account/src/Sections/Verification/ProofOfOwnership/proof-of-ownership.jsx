import React, { useState } from 'react';
import ProofOfOwnershipForm from './proof-of-ownership-form.jsx';
import POOSubmitted from 'Components/poo-submitted';

// TODO: get real ownership object from get_account_status call
const ownership_temp = {
    requests: [
        {
            creation_time: '3 o clock',
            id: 'abc1234',
            payment_method: 'E-wallet',
            payment_method_identifier: '23543656',
        },
        {
            creation_time: '4 o clock',
            id: 'abc1235',
            payment_method: 'ZingPay',
            payment_method_identifier: '4463467',
        },
        {
            creation_time: '5 o clock',
            id: 'abc1236',
            payment_method: 'OnlineNaira',
            payment_method_identifier: '7465747363',
        },
        {
            creation_time: '6 o clock',
            id: 'abc1237',
            payment_method: 'Beyonic',
            payment_method_identifier: '56765743',
        },
        {
            creation_time: '7 o clock',
            id: 'abc1238',
            payment_method: 'Bank Transfer/Bank Wire',
            payment_method_identifier: '453647774323',
        },
        {
            creation_time: '8 o clock',
            id: 'abc1239',
            payment_method: 'other',
            payment_method_identifier: '53456',
        },
        {
            creation_time: '9 o clock',
            id: 'abc12340',
            payment_method: 'Credit / Debit card',
            payment_method_identifier: '3245346346',
        },
    ],
    status: 'pending',
};

const ProofOfOwnership = ({ ownership = ownership_temp }) => {
    const [cards] = useState(ownership.requests);
    const [status] = useState(ownership.status);

    const handleSubmit = e => {
        e.preventDefault();
        // TODO: submit logic
    };

    if (status === 'pending' && cards.length) {
        return <ProofOfOwnershipForm cards={cards} handleSubmit={handleSubmit} />;
    }
    // TODO: add screen for approved POO (status === 'none')
    if (status === 'none') {
        return null;
    }
    return <POOSubmitted />;
};

export default ProofOfOwnership;
