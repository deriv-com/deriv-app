import { localize } from '@deriv/translations';
import { generateValidationFunction, getDefaultFields } from '@deriv/shared';
import { TSchema } from 'Types';

const currency_selector_config: TSchema = {
    currency: {
        supported_in: ['maltainvest', 'malta', 'svg', 'iom'],
        default_value: '',
        rules: [['req', localize('Select an item')]],
    },
};

const currencySelectorConfig = (
    { real_account_signup_target }: { real_account_signup_target: string },
    CurrencySelector: React.Component,
    is_appstore: boolean
) => {
    return {
        header: {
            active_title: is_appstore ? localize('Select wallet currency') : localize('Please choose your currency'),
            title: is_appstore ? localize('CURRENCY') : localize('Account currency'),
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
