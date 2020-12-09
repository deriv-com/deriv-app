import { localize } from '@deriv/translations';
import CurrencySelector from './currency-selector.jsx';
import { generateValidationFunction, getDefaultFields } from './form-validations';

export const currency_selector_config = {
    currency: {
        supported_in: ['maltainvest', 'malta', 'svg', 'iom'],
        default_value: '',
        rules: [['req', localize('Select an item')]],
    },
};

export const currencySelectorConfig = ({ real_account_signup_target }) => {
    return {
        header: {
            active_title: localize('Please choose your currency'),
            title: localize('Account currency'),
        },
        body: CurrencySelector,
        form_value: getDefaultFields(real_account_signup_target, currency_selector_config),
        props: {
            validate: generateValidationFunction(real_account_signup_target, currency_selector_config),
        },
        passthrough: ['legal_allowed_currencies'],
    };
};
