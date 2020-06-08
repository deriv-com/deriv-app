import { addressDetailsConfig } from './address-details-form';
import { currencySelectorConfig } from './currency-selector-form';
import { personalDetailsConfig } from './personal-details-form';
import { termsOfUseConfig } from './terms-of-use-form';

const shouldShowAddressDetails = ({ real_account_signup_target }) => real_account_signup_target !== 'maltainvest';

export const getItems = props => {
    return [
        currencySelectorConfig(props),
        personalDetailsConfig(props),
        ...(shouldShowAddressDetails(props) ? [addressDetailsConfig(props)] : []),
        termsOfUseConfig(props),
    ];
};
