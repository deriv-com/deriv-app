import mock_exchange_rates from './exchange_rates';
import mock_payout_currencies from './payout_currencies';
import mock_time from './time';
import mock_website_status from './website_status';

const general = context => {
    mock_exchange_rates(context);
    mock_payout_currencies(context);
    mock_time(context);
    mock_website_status(context);
};

export default general;
