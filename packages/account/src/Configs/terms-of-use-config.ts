import React from 'react';
import { getDefaultFields, isDesktop, TSchema } from '@deriv/shared';
import { localize } from '@deriv/translations';

const terms_of_use_config: TSchema = {
    agreed_tos: {
        supported_in: ['svg', 'maltainvest'],
        default_value: false,
    },
    agreed_tnc: {
        supported_in: ['svg', 'maltainvest'],
        default_value: false,
    },
};

const termsOfUseConfig = (
    { real_account_signup_target }: { real_account_signup_target: string },
    TermsOfUse: React.Component
) => {
    const active_title = localize('Terms of use');
    return {
        header: {
            active_title: isDesktop() ? active_title : null,
            title: active_title,
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
