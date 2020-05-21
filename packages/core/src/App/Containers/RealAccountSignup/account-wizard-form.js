import { addressDetailsConfig } from './address-details-form';
import { currencySelectorConfig } from './currency-selector-form';
import { financialAssessmentConfig } from './financial-assessment-form';
import { personalDetailsConfig } from './personal-details-form';
import { proofOfAddressConfig } from './proof-of-address-form';
import { proofOfIdentityConfig } from './proof-of-identity-form';
import { termsOfUseConfig } from './terms-of-use-form';

const shouldShowAddressDetails = ({ can_upgrade_to, is_im_residence }) => {
    if (['svg', 'malta'].includes(can_upgrade_to)) {
        return true;
    }
    if (can_upgrade_to === 'iom') {
        return is_im_residence;
    }
    return false; // for maltainvest clients
};

const shouldShowPOIPOA = ({ can_upgrade_to, is_im_residence }) => {
    if (['svg', 'malta'].includes(can_upgrade_to)) {
        return false;
    }
    if (can_upgrade_to === 'iom') {
        return !is_im_residence;
    }
    return true;
};

export const getItems = props => {
    return [
        currencySelectorConfig(props),
        personalDetailsConfig(props),
        ...(shouldShowAddressDetails(props) ? [addressDetailsConfig(props)] : []),
        ...(shouldShowPOIPOA(props) ? [proofOfIdentityConfig(props)] : []),
        ...(shouldShowPOIPOA(props) ? [proofOfAddressConfig(props)] : []),
        ...(shouldShowFinancialAssessment(props) ? [financialAssessmentConfig(props)] : []),
        termsOfUseConfig(props),
    ];
};
