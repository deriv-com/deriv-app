import mock_exchange_rates from './exchange_rates';
import mock_payout_currencies from './payout_currencies';
import mock_residents_list from './residents_list';
import mock_states_list from './states_list';
import mock_time from './time';
import mock_website_status from './website_status';
import { Context } from 'Utils/mocks/mocks';

const general = (context: Context) => {
    mock_exchange_rates(context);
    mock_payout_currencies(context);
    mock_time(context);
    mock_website_status(context);
    mock_residents_list(context);
    mock_states_list(context);
};

export default general;
