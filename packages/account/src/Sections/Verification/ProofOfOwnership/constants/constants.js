export const POO_STATUSES = {
    none: 'none',
    ownership: 'ownership',
    pending: 'pending',
    rejected: 'rejected',
    verified: 'verified',
};
export const IDENTIFIER_TYPES = {
    account_id: 'account_id',
    account_number: 'account_number',
    bank_account_number: 'bank_account_number',
    card_number: 'card_number',
    email_address: 'email_address',
    mobile_number: 'mobile_number',
    user_id: 'user_id',
};
export const VALIDATIONS = {
    invalid_characters_regex: /[^\dX\s]/,
    formated_card_number_regex: /(^\d{4})\s(\d{2}X{2})\s(X{4})\s(\d{4}$)/,
};
