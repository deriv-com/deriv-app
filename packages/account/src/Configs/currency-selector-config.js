import { localize } from '@deriv/translations';
import { generateValidationFunction, getDefaultFields } from '@deriv/shared';
import currency_selector_config from './currency-selector-schema';

const currencySelectorConfig = ({ real_account_signup_target }, CurrencySelector) => {
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

export default currencySelectorConfig;
