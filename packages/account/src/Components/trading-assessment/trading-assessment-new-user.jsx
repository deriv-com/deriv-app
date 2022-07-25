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
        onSubmit(getCurrentStep() - 1, values, actions.setSubmitting, goToNextStep, should_override);
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
