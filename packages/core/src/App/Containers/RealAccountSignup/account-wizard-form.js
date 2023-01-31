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
import { ContentFlag } from '@deriv/shared';
import AddressDetails from './address-details.jsx';
import CurrencySelector from './currency-selector.jsx';

const isMaltaAccount = ({ real_account_signup_target }) => real_account_signup_target === 'maltainvest';
const shouldShowPersonalAndAddressDetailsAndCurrency = ({ real_account_signup_target }) =>
    real_account_signup_target !== 'samoa';

const shouldShowIdentityInformation = ({ account_settings, residence, residence_list, content_flag }) => {
    const citizen = account_settings.citizen || residence;
    const country = residence_list.find(item => item.value === citizen);
    const low_risk_eu_signup = content_flag === ContentFlag.LOW_RISK_CR_EU;
    const eu_residence = content_flag === ContentFlag.EU_REAL;
    const eu_signup = low_risk_eu_signup || eu_residence;
    return !eu_signup && citizen && country?.identity?.services?.idv?.is_country_supported;
};

export const getItems = props => {
    return [
        ...(shouldShowPersonalAndAddressDetailsAndCurrency(props)
            ? [currencySelectorConfig(props, CurrencySelector)]
            : []),
        ...(shouldShowPersonalAndAddressDetailsAndCurrency(props)
            ? [personalDetailsConfig(props, PersonalDetails)]
            : []),
        ...(shouldShowPersonalAndAddressDetailsAndCurrency(props) ? [addressDetailsConfig(props, AddressDetails)] : []),
        ...(isMaltaAccount(props) ? [tradingAssessmentConfig(props, TradingAssessmentNewUser)] : []),
        ...(shouldShowIdentityInformation(props) ? [proofOfIdentityConfig(props, ProofOfIdentityFormOnSignup)] : []),
        termsOfUseConfig(props, TermsOfUse),
    ];
};
