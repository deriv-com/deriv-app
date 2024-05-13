import React from 'react';
import { generateValidationFunction, getDefaultFields, TSchema } from '@deriv/shared';
import { localize } from '@deriv/translations';

const currency_selector_config: TSchema = {
    currency: {
        supported_in: ['maltainvest', 'svg'],
        default_value: '',
        rules: [['req', localize('Select an item')]],
    },
};

const currencySelectorConfig = (
    { real_account_signup_target }: { real_account_signup_target: string },
    CurrencySelector: React.Component
) => {
    return {
        header: {
            active_title: localize('Select your preferred currency'),
            title: localize('Account currency'),
        },
        body: CurrencySelector,
        form_value: getDefaultFields(real_account_signup_target, currency_selector_config),
        props: {
            validate: generateValidationFunction(real_account_signup_target, currency_selector_config),
        },
        passthrough: ['legal_allowed_currencies'],
        icon: 'IcDashboardCurrency',
    };
};

export default currencySelectorConfig;
