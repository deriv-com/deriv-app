import {
    PersonalDetails,
    ProofOfIdentityFormOnSignup,
    TermsOfUse,
    TradingAssessmentNewUser,
    addressDetailsConfig,
    currencySelectorConfig,
    financialDetailsConfig,
    personalDetailsConfig,
    proofOfIdentityConfig,
    termsOfUseConfig,
    tradingAssessmentConfig,
} from '@deriv/account';

import AddressDetails from './address-details.jsx';
import CurrencySelector from './currency-selector.jsx';
import FinancialDetails from './financial-details.jsx';

const isMaltaAccount = ({ real_account_signup_target }) => real_account_signup_target === 'maltainvest';
const shouldShowPersonalAndAddressDetailsAndCurrency = ({ real_account_signup_target }) =>
    real_account_signup_target !== 'samoa';

const shouldShowIdentityInformation = ({
    account_status,
    account_settings,
    residence,
    residence_list,
    real_account_signup_target,
}) => {
    const citizen = account_settings.citizen || residence;
    const country = residence_list.find(item => item.value === citizen);
    const maltainvest = real_account_signup_target === 'maltainvest';
    const should_skip_idv = account_status?.status?.some(status => status === 'skip_idv'); //status added by BE when idv should be skipped for the user
    return !maltainvest && citizen && country?.identity?.services?.idv?.is_country_supported && !should_skip_idv;
};

export const getItems = props => [
    ...(shouldShowPersonalAndAddressDetailsAndCurrency(props) ? [currencySelectorConfig(props, CurrencySelector)] : []),
    ...(shouldShowPersonalAndAddressDetailsAndCurrency(props) ? [personalDetailsConfig(props, PersonalDetails)] : []),
    ...(shouldShowPersonalAndAddressDetailsAndCurrency(props) ? [addressDetailsConfig(props, AddressDetails)] : []),
    ...(isMaltaAccount(props) ? [tradingAssessmentConfig(props, TradingAssessmentNewUser)] : []),
    ...(isMaltaAccount(props) ? [financialDetailsConfig(props, FinancialDetails)] : []),
    ...(shouldShowIdentityInformation(props) ? [proofOfIdentityConfig(props, ProofOfIdentityFormOnSignup)] : []),
    termsOfUseConfig(props, TermsOfUse),
];
