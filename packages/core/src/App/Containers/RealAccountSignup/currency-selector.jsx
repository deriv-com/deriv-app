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
}))(CurrencySelector);
