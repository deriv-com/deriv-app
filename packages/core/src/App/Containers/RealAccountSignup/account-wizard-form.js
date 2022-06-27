import {
    currencySelectorConfig,
    personalDetailsConfig,
    addressDetailsConfig,
    financialDetailsConfig,
    PersonalDetails,
    termsOfUseConfig,
    TermsOfUse,
    proofOfIdentityConfig,
    ProofOfIdentityFormOnSignup,
} from '@deriv/account';
import CurrencySelector from './currency-selector.jsx';
import FinancialDetails from './financial-details.jsx';
import AddressDetails from './address-details.jsx';

const shouldShowFinancialDetails = ({ real_account_signup_target }) => real_account_signup_target === 'maltainvest';
const shouldShowPersonalAndAddressDetailsAndCurrency = ({ real_account_signup_target }) =>
    real_account_signup_target !== 'samoa';

const shouldShowIdentityInformation = ({ account_settings, residence_list }) => {
    const citizen = { account_settings };
    const country = residence_list.find(residence => residence.value === account_settings.citizen);
    return citizen && country?.identity?.services?.idv?.is_country_supported;
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
        ...(shouldShowIdentityInformation(props) ? [proofOfIdentityConfig(props, ProofOfIdentityFormOnSignup)] : []),
        ...(shouldShowFinancialDetails(props) ? [financialDetailsConfig(props, FinancialDetails)] : []),
        termsOfUseConfig(props, TermsOfUse),
    ];
};
