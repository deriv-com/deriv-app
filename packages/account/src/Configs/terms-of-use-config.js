import { isDesktop, getDefaultFields } from '@deriv/shared';
import { localize } from '@deriv/translations';

const terms_of_use_config = {
    agreed_tos: {
        supported_in: ['svg', 'iom'],
        default_value: false,
    },
    agreed_tnc: {
        supported_in: ['svg', 'iom'],
        default_value: false,
    },
};

const termsOfUseConfig = ({ real_account_signup_target }, TermsOfUse, is_dashboard = false) => {
    const active_title = is_dashboard ? localize('Our terms of use') : localize('Terms of use');
    return {
        header: {
            active_title: isDesktop() ? active_title : null,
            title: is_dashboard ? localize('TERMS OF USE') : localize('Terms of use'),
        },
        body: TermsOfUse,
        form_value: getDefaultFields(real_account_signup_target, terms_of_use_config),
        props: {
            real_account_signup_target,
        },
        icon: 'IcDashboardTermsOfUse',
    };
};

export default termsOfUseConfig;
