import mock_exchange_rates from './exchangeRates';
import mock_payout_currencies from './payoutCurrencies';
import mock_residents_list from './residentsList';
import mock_states_list from './statesList';
import mock_time from './time';
import mock_website_status from './websiteStatus';
import { Context } from '../../utils/mocks/mocks';

const general = (context: Context) => {
    mock_exchange_rates(context);
    mock_payout_currencies(context);
    mock_time(context);
    mock_website_status(context);
    mock_residents_list(context);
    mock_states_list(context);
};

export default general;
