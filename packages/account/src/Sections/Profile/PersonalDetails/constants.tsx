import React from 'react';
import { localize, Localize } from '@deriv/translations';

export const account_opening_reason_list = [
    { text: localize('Speculative'), value: 'Speculative' },
    { text: localize('Income Earning'), value: 'Income Earning' },
    { text: localize('Hedging'), value: 'Hedging' },
];

export const salutation_list = [
    { text: <Localize i18n_default_text='Mr' />, value: 'Mr' },
    { text: <Localize i18n_default_text='Mrs' />, value: 'Mrs' },
    { text: <Localize i18n_default_text='Ms' />, value: 'Ms' },
    { text: <Localize i18n_default_text='Miss' />, value: 'Miss' },
];
