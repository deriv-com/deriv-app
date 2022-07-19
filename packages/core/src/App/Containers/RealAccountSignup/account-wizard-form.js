import {
    currencySelectorConfig,
    personalDetailsConfig,
    addressDetailsConfig,
    financialDetailsConfig,
    PersonalDetails,
    termsOfUseConfig,
    tradingAssessmentConfig,
    TradingAssessmentNewUser,
    TermsOfUse,
} from '@deriv/account';
import CurrencySelector from './currency-selector.jsx';
// import FinancialDetails from './financial-details.jsx';
import AddressDetails from './address-details.jsx';

// const { TradingAssessmentNewUser } = TradingAssessment;
// const shouldShowFinancialDetails = ({ real_account_signup_target }) => real_account_signup_target === 'maltainvest';
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
        // ...(shouldShowFinancialDetails(props) ? [financialDetailsConfig(props, FinancialDetails)] : []),
        termsOfUseConfig(props, TermsOfUse),
    ];
};
