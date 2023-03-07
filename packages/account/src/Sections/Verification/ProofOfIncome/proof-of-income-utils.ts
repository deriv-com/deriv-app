import { localize } from '@deriv/translations';

export type TPoincStatusCodes = Readonly<Record<'none' | 'pending' | 'rejected' | 'verified' | 'locked', string>>;

export const income_status_codes: TPoincStatusCodes = {
    none: 'none',
    pending: 'pending',
    rejected: 'rejected',
    verified: 'verified',
    locked: 'locked',
};

type TPoincDocumentList = { text: string; value: string }[];

export const poinc_documents_list: TPoincDocumentList = [
    { text: localize('Tax return'), value: 'tax_return' },
    { text: localize('Employment contract'), value: 'employment_contract' },
    { text: localize('Payslip'), value: 'payslip' },
    { text: localize('COI'), value: 'coi' },
    { text: localize('Business POA'), value: 'business_poa' },
    { text: localize('Article of association'), value: 'article_of_association' },
    { text: localize('Memorandum'), value: 'memorandum' },
    { text: localize('Authorisation letter'), value: 'authorisation_letter' },
    { text: localize('Declarations'), value: 'declarations' },
];
