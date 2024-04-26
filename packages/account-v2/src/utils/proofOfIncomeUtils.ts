// export const income_status_codes = {
//     NONE: 'none',
//     PENDING: 'pending',
//     REJECTED: 'rejected',
//     VERIFIED: 'verified',
//     LOCKED: 'locked',
// } as const;

export const ProofOfIncomeUtils = () => {
    return [
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
};
