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

const shouldShowIdentityInformation = ({ account_settings, residence, residence_list, real_account_signup_target }) => {
    const citizen = account_settings.citizen || residence;
    const country = residence_list.find(item => item.value === citizen);
    const maltainvest = real_account_signup_target === 'maltainvest';
    return !maltainvest && citizen && country?.identity?.services?.idv?.is_country_supported;
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
