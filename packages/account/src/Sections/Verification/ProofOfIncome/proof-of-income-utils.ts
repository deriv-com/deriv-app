import { localize } from '@deriv/translations';

export const income_status_codes = {
    NONE: 'none',
    PENDING: 'pending',
    REJECTED: 'rejected',
    VERIFIED: 'verified',
    LOCKED: 'locked',
} as const;

export const getPoincDocumentsList = () =>
    [
        { text: localize('Tax return'), value: 'tax_return' },
        { text: localize('Employment contract'), value: 'employment_contract' },
        { text: localize('Payslip'), value: 'payslip' },
        { text: localize('Certificate of incorporation'), value: 'coi' },
        { text: localize('Business proof of address'), value: 'business_poa' },
        { text: localize('Article of association'), value: 'article_of_association' },
        { text: localize('Memorandum'), value: 'memorandum' },
        { text: localize('Authorization letter'), value: 'authorisation_letter' },
        { text: localize('Declarations'), value: 'declarations' },
    ] as const;
