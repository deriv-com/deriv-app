import {
    currencySelectorConfig,
    personalDetailsConfig,
    addressDetailsConfig,
    PersonalDetails,
    termsOfUseConfig,
    tradingAssessmentConfig,
    TradingAssessmentNewUser,
    TermsOfUse,
    proofOfIdentityConfig,
    ProofOfIdentityFormOnSignup,
} from '@deriv/account';

import AddressDetails from './address-details.jsx';
import CurrencySelector from './currency-selector.jsx';

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
    const is_age_verified = account_status?.status?.some(status => status === 'age_verification');
    const { submissions_left: idv_submissions_left } = account_status?.authentication?.identity?.services?.idv;
    return (
        !maltainvest &&
        citizen &&
        country?.identity?.services?.idv?.is_country_supported &&
        !is_age_verified &&
        Number(idv_submissions_left) > 0
    );
};

export const getItems = props => [
    ...(shouldShowPersonalAndAddressDetailsAndCurrency(props) ? [currencySelectorConfig(props, CurrencySelector)] : []),
    ...(shouldShowPersonalAndAddressDetailsAndCurrency(props) ? [personalDetailsConfig(props, PersonalDetails)] : []),
    ...(shouldShowPersonalAndAddressDetailsAndCurrency(props) ? [addressDetailsConfig(props, AddressDetails)] : []),
    ...(isMaltaAccount(props) ? [tradingAssessmentConfig(props, TradingAssessmentNewUser)] : []),
    ...(shouldShowIdentityInformation(props) ? [proofOfIdentityConfig(props, ProofOfIdentityFormOnSignup)] : []),
    termsOfUseConfig(props, TermsOfUse),
];
