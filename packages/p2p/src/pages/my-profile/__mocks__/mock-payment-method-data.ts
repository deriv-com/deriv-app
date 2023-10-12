export const payment_method_info_alipay = {
    id: '37',
    display_name: 'Alipay',
    fields: {
        account: { display_name: 'Alipay ID', required: 1, type: 'text', value: 'test_account' },
        instructions: { display_name: 'Instructions', required: 0, type: 'memo', value: 'test_alipay_instructions' },
    },
    icon: 'IcCashierEwallet',
    is_enabled: 1,
    method: 'alipay',
    type: 'ewallet',
    used_by_adverts: ['1'],
    used_byOrders: ['2'],
};

export const payment_method_info_bank = {
    id: '38',
    display_name: 'Bank Transfer',
    fields: {
        account: { display_name: 'Account Number', required: 1, type: 'text', value: '' },
        bank_code: { display_name: 'SWIFT or IFSC code', required: 0, type: 'text', value: '1234' },
        bank_name: { display_name: 'Bank Name', required: 1, type: 'text', value: 'test_bank_name' },
        branch: { display_name: 'Branch', required: 0, type: 'text', value: 'test_branch' },
        instructions: { display_name: 'Instructions', required: 0, type: 'memo', value: 'test_bank_instructions' },
    },
    icon: 'IcCashierBankTransfer',
    is_enabled: 1,
    method: 'bank_transfer',
    type: 'bank',
    used_by_adverts: ['1'],
    used_by_orders: ['2'],
};
