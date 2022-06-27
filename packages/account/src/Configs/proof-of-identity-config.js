import { localize } from '@deriv/translations';

const proofOfIdentityConfig = ({ account_settings, residence_list }, ProofOfIdentityForm) => {
    return {
        header: {
            active_title: localize('Identity information'),
            title: localize('Identity information'),
        },
        body: ProofOfIdentityForm,
        props: { citizen: account_settings.citizen },
        passthrough: ['refreshNotifications', 'residence_list'],
    };
};

export default proofOfIdentityConfig;
