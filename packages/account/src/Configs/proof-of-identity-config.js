import { localize } from '@deriv/translations';

const proofOfIdentityConfig = ({ account_settings }, ProofOfIdentityForm) => {
    return {
        header: {
            active_title: localize('Identity information'),
            title: localize('Identity information'),
        },
        body: ProofOfIdentityForm,
        props: { citizen: account_settings.citizen || account_settings.country_code },
        passthrough: ['refreshNotifications', 'residence_list'],
    };
};

export default proofOfIdentityConfig;
