export const IDV_ERROR_STATUS = Object.freeze({
    DobMismatch: {
        code: 'DobMismatch',
        message: "The date of birth retrieved from your document doesn't match your profile.",
    },
    DocumentRejected: { code: 'DocumentRejected', message: 'Document was rejected by the provider' },
    EmptyStatus: {
        code: 'EmptyStatus',
        message: 'The verification status was empty, rejected for lack of information.',
    },
    Expired: { code: 'Expired', message: "The document's validity has been expired." },
    InformationLack: {
        code: 'InformationLack',
        message: 'The verification is passed but the personal info is not available to compare.',
    },
    MalformedJson: {
        code: 'MalformedJson',
        message: 'The verification status is not available, provider says: Malformed JSON.',
    },
    NameMismatch: {
        code: 'NameMismatch',
        message: "The name retrieved from your document doesn't match your profile.",
    },
    RejectedByProvider: {
        code: 'RejectedByProvider',
        message: 'The document was rejected by the Provider.',
    },
    Underage: {
        code: 'Underage',
        message: "You're under legal age.",
    },
    Deceased: {
        code: 'Deceased',
        message: "The document's owner is deceased.",
    },
    Failed: {
        code: 'Failed',
        message: 'We were unable to verify the identity document with the details provided.',
    },
    NameDOBMismatch: {
        code: 'NameDOBMismatch',
        message: '',
    },
});

export const Onfido_ERROR_STATUS = Object.freeze({
    AgeValidationMinimumAcceptedAge: {
        code: 'AgeValidationMinimumAcceptedAge',
        message:
            "Your age in the document you provided appears to be below 18 years. We're only allowed to offer our services to clients above 18 years old, so we'll need to close your account. If you have a balance in your account, contact us via live chat and we'll help to withdraw your funds before your account is closed.",
    },
    CompromisedDocument: {
        code: 'CompromisedDocument',
        message: 'Your document failed our verification checks.',
    },
});
