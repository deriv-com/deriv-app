import AccountLimits from 'Components/account-limits/account-limits';
import 'Components/account-limits/account-limits.scss';
import { connect } from 'Stores/connect';

export default connect(({ client, common, ui }) => ({
    account_limits: client.account_limits,
    currency: client.currency,
    getLimits: client.getLimits,
    is_fully_authenticated: client.is_fully_authenticated,
    is_from_derivgo: common.is_from_derivgo,
    is_virtual: client.is_virtual,
    is_switching: client.is_switching,
    should_show_article: true,
    toggleAccountsDialog: ui.toggleAccountsDialog,
}))(AccountLimits);
