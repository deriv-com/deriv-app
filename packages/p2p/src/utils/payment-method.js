export const getPaymentMethodIcon = payment_method_name => {
    if (payment_method_name === 'BankTransfer' || payment_method_name === 'Other')
        return `IcCashier${payment_method_name}`;
    else if (payment_method_name === 'UnifiedPaymentsInterface(UPI)') return `IcCashierBankTransfer`;
    return 'IcCashierEwallet';
};
