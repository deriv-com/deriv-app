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
    has_invalid_characters: target_string => /[^\dX\s]/.test(target_string),
    is_formated_card_number: target_string => /(^\d{4})\s(\d{2}X{2})\s(X{4})\s(\d{4}$)/.test(target_string),
};
