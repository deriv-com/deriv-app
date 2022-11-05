export default {
    requests: [
        {
            id: '1',
            payment_method: 'beyonic',
            documents_required: 1,
        },
        {
            id: '2',
            payment_method: 'boleto (d24 voucher)',
            documents_required: 1,
        },
    ],
    status: 'pending',
};

export const grouped_payment_method_data = {
    beyonic: {
        icon: 'IcBeyonic',
        payment_method: 'beyonic',
        items: [
            {
                id: '1',
                payment_method: 'beyonic',
                documents_required: 1,
            },
        ],
        instructions: ['Upload your mobile bill statement showing your name and phone number.'],
        input_label: 'Mobile number',
        identifier_type: 'mobile_number',
        is_generic_pm: false,
    },
    visa: {
        icon: 'IcVisaLight',
        payment_method: 'visa',
        items: [
            {
                id: '4',
                payment_method: 'visa',
                documents_required: 1,
            },
        ],
        instructions: [
            'Upload a photo showing your name and the first six and last four digits of your card number. If the card does not display your name, upload the bank statement showing your name and card number in the transaction history.',
        ],
        input_label: 'Card number',
        identifier_type: 'card_number',
        is_generic_pm: false,
    },
    onlinenaira: {
        icon: 'IcOnlineNaira',
        payment_method: 'onlinenaira',
        items: [
            {
                id: '9',
                payment_method: 'onlinenaira',
                documents_required: 2,
            },
        ],
        instructions: [
            'Upload a screenshot of your username on the General Information page at https://onlinenaira.com/members/index.htm',
            'Upload a screenshot of your account number and phone number on the Bank Account/Mobile wallet page at https://onlinenaira.com/members/bank.htm',
        ],
        input_label: 'Account ID',
        identifier_type: 'account_id',
        is_generic_pm: false,
    },
};
