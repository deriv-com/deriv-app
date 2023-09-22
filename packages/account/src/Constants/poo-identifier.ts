export const IDENTIFIER_TYPES = Object.freeze({
    ACCOUNT_ID: 'account_id',
    ACCOUNT_NUMBER: 'account_number',
    BANK_ACCOUNT_NUMBER: 'bank_account_number',
    CARD_NUMBER: 'card_number',
    EMAIL_ADDRESS: 'email_address',
    MOBILE_NUMBER: 'mobile_number',
    USER_ID: 'user_id',
});

export const POO_STATUSES = {
    NONE: 'none',
    OWNER_SHIP: 'ownership',
    PENDING: 'pending',
    REJECTED: 'rejected',
    VERIFIED: 'verified',
};

export const VALIDATIONS = {
    hasInvalidCharacters: (target_string: string) => /[^\dX\s]/.test(target_string),
    isFormattedCardNumber: (target_string: string) => /(^\d{4})\s(\d{2}X{2})\s(X{4})\s(\d{4}$)/.test(target_string),
};
