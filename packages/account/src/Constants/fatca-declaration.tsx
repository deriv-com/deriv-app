import React from 'react';
import { Localize, localize } from '@deriv/translations';

export const getFatcaDeclaration = () => [
    <Localize i18n_default_text='US citizenship or lawful permanent resident (green card) status' key='1' />,
    <Localize i18n_default_text='A US birthplace' key='2' />,
    <Localize
        i18n_default_text='A US residence address or a US correspondence address (including a US PO box)'
        key='3'
    />,
    <Localize
        i18n_default_text='Standing instructions to transfer funds to an account maintained in the United States, or directions regularly received from a US address'
        key='4'
    />,
    <Localize
        i18n_default_text='An “in care of” address or a “hold mail” address that is the sole address with respect to the client'
        key='5'
    />,
    <Localize
        i18n_default_text='A power of attorney or signatory authority granted to a person with a US address.'
        key='6'
    />,
];

export const getAgreementOptions = () => [
    { text: localize('Yes'), value: '1' },
    { text: localize('No'), value: '0' },
];
