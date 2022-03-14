import { CurrencySelector } from '@deriv/account';
import { connect } from 'Stores/connect';
import './currency-selector.scss';

export default connect(({ client, ui }) => ({
    currencies: client.currencies_list,
    has_currency: !!client.currency,
    has_real_account: client.has_active_real_account,
    legal_allowed_currencies: client.upgradeable_currencies,
    real_account_signup: ui.real_account_signup,
    resetRealAccountSignupParams: ui.resetRealAccountSignupParams,
    selectable_currencies: client.selectable_currencies,
    available_crypto_currencies: client.available_crypto_currencies,
    real_account_signup_target: ui.real_account_signup_target,
    is_dxtrade_allowed: client.is_dxtrade_allowed,
    is_mt5_allowed: client.is_mt5_allowed,
    has_fiat: client.has_fiat,
    accounts: client.accounts,
    is_eu: client.is_eu,
}))(CurrencySelector);
