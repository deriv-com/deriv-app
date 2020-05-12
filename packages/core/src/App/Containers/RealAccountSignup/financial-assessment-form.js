import { localize } from '@deriv/translations';
import { FinancialAssessment } from '@deriv/account/lib/js/components';
import { generateValidationFunction, getDefaultFields } from './form-validations';

const financial_assessment_config = {
    poi_state: {
        supported_in: ['maltainvest', 'malta', 'svg', 'iom'],
        default_value: '',
        rules: [],
    },
};

export const financialAssessmentConfig = ({ can_upgrade_to }) => {
    return {
        header: {
            active_title: localize('Complete financial assessment'),
            title: localize('Financial assessment'),
        },
        body: FinancialAssessment,
        form_value: getDefaultFields(can_upgrade_to, financial_assessment_config),
        props: {
            validate: generateValidationFunction(can_upgrade_to, financial_assessment_config),
        },
        passthrough: [],
    };
};
