export const payment_method_info_alipay = {
    ID: '37',
    display_name: 'Alipay',
    fields: {
        account: { display_name: 'Alipay ID', required: 1, type: 'text', value: 'test_account' },
        instructions: { display_name: 'Instructions', required: 0, type: 'memo', value: 'test_alipay_instructions' },
    },
    is_enabled: 1,
    method: 'alipay',
};

export const payment_method_info_bank = {
    ID: '38',
    display_name: 'Bank Transfer',
    fields: {
        account: { display_name: 'Account Number', required: 1, type: 'text', value: '' },
        bank_code: { display_name: 'SWIFT or IFSC code', required: 0, type: 'text', value: '1234' },
        bank_name: { display_name: 'Bank Name', required: 1, type: 'text', value: 'test_bank_name' },
        branch: { display_name: 'Branch', required: 0, type: 'text', value: 'test_branch' },
        instructions: { display_name: 'Instructions', required: 0, type: 'memo', value: 'test_bank_instructions' },
    },
    is_enabled: 1,
    method: 'bank_transfer',
};

export const payment_method_info_other = {
    ID: '39',
    display_name: 'Other',
    fields: {
        account: { display_name: 'Account ID / phone number / email', required: 0, type: 'text', value: '1212' },
        instructions: { display_name: 'Instructions', required: 0, type: 'memo', value: 'test_other_instructions' },
        name: { display_name: 'Payment method name', required: 1, type: 'text', value: 'test_other' },
    },
    is_enabled: 1,
    method: 'other',
};
