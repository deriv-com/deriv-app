import {
    FinancialDetails,
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

import AddressDetails from '@deriv/account/src/Components/address-details';
import CurrencySelector from '@deriv/account/src/Components/currency-selector';

const isMaltaAccount = ({ real_account_signup_target }) => real_account_signup_target === 'maltainvest';

export const getItems = props => [
    currencySelectorConfig(props, CurrencySelector),
    personalDetailsConfig(props, PersonalDetails),
    addressDetailsConfig(props, AddressDetails),
    ...(isMaltaAccount(props) ? [tradingAssessmentConfig(props, TradingAssessmentNewUser)] : []),
    ...(isMaltaAccount(props) ? [financialDetailsConfig(props, FinancialDetails)] : []),
    termsOfUseConfig(props, TermsOfUse),
];
