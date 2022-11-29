import React from 'react';
import TradingAssessmentForm from './trading-assessment-form';

const TradingAssessmentNewUser = ({
    assessment_questions,
    goToNextStep,
    goToPreviousStep,
    onSave,
    onCancel,
    onSubmit,
    getCurrentStep,
    value,
}) => {
    const handleCancel = values => {
        const current_step = getCurrentStep() - 1;
        onSave(current_step, values);
        onCancel(current_step, goToPreviousStep);
    };

    const handleSubmit = (values, actions, should_override) => {
        let process_form_values = { ...values };
        if (should_override) {
            // Remove the keys with no values
            process_form_values = Object.entries(process_form_values).reduce((accumulator, [key, val]) => {
                if (val) {
                    return { ...accumulator, [key]: val };
                }
                return { ...accumulator };
            }, {});
        }
        onSubmit(getCurrentStep() - 1, process_form_values, null, goToNextStep, should_override);
    };

    return (
        <TradingAssessmentForm
            assessment_questions={assessment_questions}
            form_value={value}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            is_header_navigation
        />
    );
};

export default TradingAssessmentNewUser;
