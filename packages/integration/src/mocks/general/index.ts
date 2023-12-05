import mockExchangeRates from './exchangeRates';
import mockPayoutCurrencies from './payoutCurrencies';
import mockResidentsList from './residentsList';
import mockStatesList from './statesList';
import mockTime from './time';
import mockWebsiteStatus from './websiteStatus';
import { Context } from '../../utils/mocks/mocks';

const general = (context: Context) => {
    mockExchangeRates(context);
    mockPayoutCurrencies(context);
    mockTime(context);
    mockWebsiteStatus(context);
    mockResidentsList(context);
    mockStatesList(context);
};

export default general;
