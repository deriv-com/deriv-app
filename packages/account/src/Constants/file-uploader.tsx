import { Localize } from '@deriv/translations';
import React from 'react';
import { TFilesDescription } from '../Types';

export const getFileUploaderDescriptions = (page: string): TFilesDescription => {
    const proof_of_income_descriptions = {
        title: <Localize i18n_default_text='The document must be recent and include your name and address:' />,
        descriptions: [
            {
                id: 'signed_document',
                value: (
                    <Localize i18n_default_text='The document must be up-to-date and signed by the issuance authority.' />
                ),
            },
            {
                id: 'contains_letterhead',
                value: <Localize i18n_default_text='The document must contain a letterhead.' />,
            },
            {
                id: 'invalid_rejected',
                value: <Localize i18n_default_text='Invalid or incomplete documents shall be rejected.' />,
            },
        ],
    };
    const proof_of_address_descriptions = {
        title: (
            <Localize i18n_default_text='We accept only these types of documents as proof of your address. The document must be recent (issued within last 6 months) and include your name and address:' />
        ),
        descriptions: [
            {
                id: 'utility_bill',
                value: <Localize i18n_default_text='Utility bill: electricity, water, gas, or landline phone bill.' />,
            },
            {
                id: 'financial_legal_government_document',
                value: (
                    <Localize i18n_default_text='Financial, legal, or government document: recent bank statement, affidavit, or government-issued letter.' />
                ),
            },
            {
                id: 'home_rental_agreement',
                value: <Localize i18n_default_text='Home rental agreement: valid and current agreement.' />,
            },
        ],
    };

    if (page === 'poinc') return proof_of_income_descriptions;
    if (page === 'poa') return proof_of_address_descriptions;
    return { title: '', descriptions: [] };
};
