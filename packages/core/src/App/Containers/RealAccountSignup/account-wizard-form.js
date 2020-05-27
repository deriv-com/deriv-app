import { addressDetailsConfig } from './address-details-form';
import { currencySelectorConfig } from './currency-selector-form';
import { financialAssessmentConfig } from './financial-assessment-form';
import { personalDetailsConfig } from './personal-details-form';
import { termsOfUseConfig } from './terms-of-use-form';

const shouldShowAddressDetails = ({ real_account_signup_target }) =>
    !shouldShowFinancialAssessment({ real_account_signup_target });

const shouldShowFinancialAssessment = ({ real_account_signup_target }) => {
    return !['svg', 'malta', 'iom'].includes(real_account_signup_target);
};

export const getItems = props => {
    return [
        currencySelectorConfig(props),
        personalDetailsConfig(props),
        ...(shouldShowAddressDetails(props) ? [addressDetailsConfig(props)] : []),
        ...(shouldShowFinancialAssessment(props) ? [financialAssessmentConfig(props)] : []),
        termsOfUseConfig(props),
    ];
};
