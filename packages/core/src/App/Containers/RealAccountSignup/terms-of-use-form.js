import { isDesktop } from '@deriv/shared';
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

export const termsOfUseConfig = ({ real_account_signup_target }) => {
    return {
        header: {
            active_title: isDesktop() ? localize('Terms of use') : null,
            title: localize('Terms of use'),
        },
        body: TermsOfUse,
        form_value: getDefaultFields(real_account_signup_target, terms_of_use_config),
        props: {
            real_account_signup_target,
        },
    };
};
