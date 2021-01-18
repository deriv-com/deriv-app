import {
    currencySelectorConfig,
    personalDetailsConfig,
    addressDetailsConfig,
    termsOfUseConfig,
    financialDetailsConfig,
    PersonalDetails,
    TermsOfUse,
} from '@deriv/account';
import CurrencySelector from './currency-selector.jsx';
import FinancialDetails from './financial-details.jsx';
import AddressDetails from './address-details.jsx';

const shouldShowFinancialDetails = ({ real_account_signup_target }) => real_account_signup_target === 'maltainvest';
const shouldShowPersonalAndAddressDetailsAndCurrency = ({ real_account_signup_target }) =>
    real_account_signup_target !== 'samoa';

export const getItems = props => {
    return [
        ...(shouldShowPersonalAndAddressDetailsAndCurrency(props)
            ? [currencySelectorConfig(CurrencySelector, props)]
            : []),
        ...(shouldShowPersonalAndAddressDetailsAndCurrency(props)
            ? [personalDetailsConfig(PersonalDetails, props)]
            : []),
        ...(shouldShowPersonalAndAddressDetailsAndCurrency(props) ? [addressDetailsConfig(AddressDetails, props)] : []),
        ...(shouldShowFinancialDetails(props) ? [financialDetailsConfig(FinancialDetails, props)] : []),
        termsOfUseConfig(TermsOfUse, props),
    ];
};
