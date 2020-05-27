import { addressDetailsConfig } from './address-details-form';
import { currencySelectorConfig } from './currency-selector-form';
import { financialAssessmentConfig } from './financial-assessment-form';
import { personalDetailsConfig } from './personal-details-form';
import { termsOfUseConfig } from './terms-of-use-form';

const shouldShowAddressDetails = ({ can_upgrade_to }) => !shouldShowPOIPOA({ can_upgrade_to });

const shouldShowPOIPOA = ({ can_upgrade_to }) => {
    return !['svg', 'malta', 'iom'].includes(can_upgrade_to);
};

export const getItems = props => {
    return [
        currencySelectorConfig(props),
        personalDetailsConfig(props),
        ...(shouldShowAddressDetails(props) ? [addressDetailsConfig(props)] : []),
        ...(shouldShowPOIPOA(props) ? [financialAssessmentConfig(props)] : []),
        termsOfUseConfig(props),
    ];
};
