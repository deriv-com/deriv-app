import { getDefaultFields } from '@deriv/shared';
import { TSchema } from 'Types';

const accept_risk_config: TSchema = {
    accept_risk: {
        supported_in: ['maltainvest'],
        default_value: 1,
    },
};

const acceptRiskConfig = (
    { real_account_signup_target }: { real_account_signup_target: string },
    AcceptRiskForm: React.Component
) => {
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
