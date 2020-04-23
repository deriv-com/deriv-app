import { isDesktop } from '@deriv/shared/utils/os';
import { localize } from '@deriv/translations';
import { getDefaultFields } from './form-validations';
import TermsOfUse from './terms-of-use.jsx';

const terms_of_use_config = {
    agreed_tos: {
        supported_in: ['svg', 'iom'],
        default_value: '',
    },
    agreed_tnc: {
        supported_in: ['svg', 'iom'],
        default_value: '',
    },
};

export const termsOfUseConfig = ({ can_upgrade_to }) => {
    return {
        header: {
            active_title: isDesktop() ? localize('Terms of use') : null,
            title: localize('Terms of use'),
        },
        body: TermsOfUse,
        form_value: getDefaultFields(can_upgrade_to, terms_of_use_config),
        props: {
            can_upgrade_to,
        },
    };
};
