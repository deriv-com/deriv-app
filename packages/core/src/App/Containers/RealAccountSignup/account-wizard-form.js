import {
    PersonalDetails,
    TermsOfUse,
    TradingAssessmentNewUser,
    addressDetailsConfig,
    currencySelectorConfig,
    financialDetailsConfig,
    personalDetailsConfig,
    termsOfUseConfig,
    tradingAssessmentConfig,
} from '@deriv/account';

import AddressDetails from './address-details';
import CurrencySelector from './currency-selector.jsx';
import FinancialDetails from './financial-details.jsx';

const isMaltaAccount = ({ real_account_signup_target }) => real_account_signup_target === 'maltainvest';
const shouldShowPersonalAndAddressDetailsAndCurrency = ({ real_account_signup_target }) =>
    real_account_signup_target !== 'samoa';

export const getItems = props => [
    ...(shouldShowPersonalAndAddressDetailsAndCurrency(props) ? [currencySelectorConfig(props, CurrencySelector)] : []),
    ...(shouldShowPersonalAndAddressDetailsAndCurrency(props) ? [personalDetailsConfig(props, PersonalDetails)] : []),
    ...(shouldShowPersonalAndAddressDetailsAndCurrency(props) ? [addressDetailsConfig(props, AddressDetails)] : []),
    ...(isMaltaAccount(props) ? [tradingAssessmentConfig(props, TradingAssessmentNewUser)] : []),
    ...(isMaltaAccount(props) ? [financialDetailsConfig(props, FinancialDetails)] : []),
    termsOfUseConfig(props, TermsOfUse),
];
