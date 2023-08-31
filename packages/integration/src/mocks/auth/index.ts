import mock_authorize from './authorize';
import mock_balance_all from './balance_all';
import mock_balance_one from './balance_one';
import mock_get_account_status from './get_account_status';
import mock_get_self_exclusion from './get_self_exclusion';
import mock_get_settings from './get_settings';
import mock_get_financial_assessment from './get_financial_assessment';
import mock_mt5_login_list from './mt5_login_list';
import mock_landing_company_svg from './landing_company_svg';
import mock_landing_company_th from './landing_company_th';
import mock_get_limits from './get_limits';
import mock_paymentagent_list from './paymentagent_list';
import mock_trading_platform_available_accounts from './trading_platform_available_accounts';
import mock_platform_mt5 from './platform_mt5';
import mock_platform_dxtrade from './platform_dxtrade';
import mock_trading_platform_accounts from './trading_platform_accounts';
import { Context } from 'Utils/mocks/mocks';

const loggedIn = async (context: Context) => {
    mock_authorize(context);
    mock_balance_all(context);
    mock_balance_one(context);
    mock_get_account_status(context);
    mock_get_self_exclusion(context);
    mock_get_settings(context);
    mock_get_financial_assessment(context);
    mock_mt5_login_list(context);
    mock_landing_company_svg(context);
    mock_landing_company_th(context);
    mock_get_limits(context);
    mock_paymentagent_list(context);
    mock_trading_platform_available_accounts(context);
    mock_platform_mt5(context);
    mock_platform_dxtrade(context);
    mock_trading_platform_accounts(context);
};

export default loggedIn;
