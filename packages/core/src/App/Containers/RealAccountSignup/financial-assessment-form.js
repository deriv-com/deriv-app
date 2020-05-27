import { localize } from '@deriv/translations';
import { FinancialAssessment } from '@deriv/account';
import { generateValidationFunction, getDefaultFields } from './form-validations';

const financial_assessment_config = {
    poi_state: {
        supported_in: ['maltainvest', 'malta', 'svg', 'iom'],
        default_value: '',
        rules: [],
    },
};

export const financialAssessmentConfig = ({ real_account_signup_target }) => {
    return {
        header: {
            active_title: localize('Complete financial assessment'),
            title: localize('Financial assessment'),
        },
        body: FinancialAssessment,
        form_value: getDefaultFields(real_account_signup_target, financial_assessment_config),
        props: {
            validate: generateValidationFunction(real_account_signup_target, financial_assessment_config),
        },
        passthrough: [],
    };
};
