import {
    currencySelectorConfig,
    personalDetailsConfig,
    addressDetailsConfig,
    PersonalDetails,
    termsOfUseConfig,
    tradingAssessmentConfig,
    TradingAssessmentNewUser,
    TermsOfUse,
} from '@deriv/account';
import CurrencySelector from './currency-selector.jsx';
import AddressDetails from './address-details.jsx';

const shouldShowTradingAssessment = ({ real_account_signup_target }) => real_account_signup_target === 'maltainvest';
const shouldShowPersonalAndAddressDetailsAndCurrency = ({ real_account_signup_target }) =>
    real_account_signup_target !== 'samoa';

export const getItems = props => {
    return [
        ...(shouldShowPersonalAndAddressDetailsAndCurrency(props)
            ? [currencySelectorConfig(props, CurrencySelector)]
            : []),
        ...(shouldShowPersonalAndAddressDetailsAndCurrency(props)
            ? [personalDetailsConfig(props, PersonalDetails)]
            : []),
        ...(shouldShowPersonalAndAddressDetailsAndCurrency(props) ? [addressDetailsConfig(props, AddressDetails)] : []),
        ...(shouldShowTradingAssessment(props) ? [tradingAssessmentConfig(props, TradingAssessmentNewUser)] : []),
        termsOfUseConfig(props, TermsOfUse),
    ];
};
