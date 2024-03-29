export const API_ERROR_CODES = Object.freeze({
    claimedDocument: {
        code: 'ClaimedDocument',
        message:
            "This document number was already submitted for a different account. It seems you have an account with us that doesn't need further verification. Please contact us via live chat if you need help.",
    },
    duplicateAccount: {
        code: 'DuplicateAccount',
        message:
            'An account with these details already exists. Please make sure the details you entered are correct as only one real account is allowed per client. If this is a mistake, contact us via live chat.',
    },
    generic: {
        code: null,
        message: 'Sorry, an internal error occurred. Hit the above checkbox to try again.',
    },
});
