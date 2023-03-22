import { getDefaultFields, Jurisdiction } from '@deriv/shared';

const accept_risk_config = {
    accept_risk: {
        supported_in: [Jurisdiction.MALTA_INVEST],
        default_value: 1,
    },
};

const acceptRiskConfig = ({ real_account_signup_target }, AcceptRiskForm) => {
    return {
        header: {},
        body: AcceptRiskForm,
        form_value: getDefaultFields(real_account_signup_target, accept_risk_config),
        props: {
            real_account_signup_target,
        },
        icon: '',
        passthrough: [],
    };
};

export default acceptRiskConfig;
