import { addressDetailsConfig } from './address-details-form';
import { currencySelectorConfig } from './currency-selector-form';
import { personalDetailsConfig } from './personal-details-form';
import { termsOfUseConfig } from './terms-of-use-form';
import { financialDetailsConfig } from './financial-details-form';

const shouldShowFinancialDetails = ({ real_account_signup_target }) => real_account_signup_target === 'maltainvest';
const shouldShowPersonalAndAddressDetailsAndCurrency = ({ real_account_signup_target }) =>
    real_account_signup_target !== 'samoa';

export const getItems = props => {
    return [
        ...(shouldShowPersonalAndAddressDetailsAndCurrency(props) ? [currencySelectorConfig(props)] : []),
        ...(shouldShowPersonalAndAddressDetailsAndCurrency(props) ? [personalDetailsConfig(props)] : []),
        ...(shouldShowPersonalAndAddressDetailsAndCurrency(props) ? [addressDetailsConfig(props)] : []),
        ...(shouldShowFinancialDetails(props) ? [financialDetailsConfig(props)] : []),
        termsOfUseConfig(props),
    ];
};
