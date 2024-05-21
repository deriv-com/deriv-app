import * as Yup from 'yup';

export const listItems = [
    'The document must be up-to-date and signed by the issuance authority.',
    'The document must contain a letterhead.',
    'Invalid or incomplete documents shall be rejected.',
];
export const documentValidation = Yup.mixed<File>();

export const poincDocumentsList = [
    { text: 'Tax return', value: 'tax_return' },
    { text: 'Employment contract', value: 'employment_contract' },
    { text: 'Payslip', value: 'payslip' },
    { text: 'Certificate of incorporation', value: 'coi' },
    { text: 'Business proof of address', value: 'business_poa' },
    { text: 'Article of association', value: 'article_of_association' },
    { text: 'Memorandum', value: 'memorandum' },
    { text: 'Authorization letter', value: 'authorisation_letter' },
    { text: 'Declarations', value: 'declarations' },
];

export const maxSizePOIC = 8388608;
