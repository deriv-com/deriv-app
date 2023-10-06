import React from 'react';
import { TFormData } from 'Types';
import TradingAssessmentForm from './trading-assessment-form';

type TTradingAssessmentNewUser = {
    disabled_items: string[];
    goToNextStep: () => void;
    goToPreviousStep: () => void;
    onSave: (current_step: number, values: TFormData) => void;
    onCancel: (current_step: number, goToPreviousStep: () => void) => void;
    onSubmit: (
        current_step: number,
        values: TFormData,
        goToNextStep: () => void,
        action: React.ReactNode,
        should_override: boolean
    ) => void;
    getCurrentStep: () => number;
    value: TFormData;
    setSubSectionIndex: (index: number) => void;
};

const TradingAssessmentNewUser = ({
    disabled_items,
    goToNextStep,
    goToPreviousStep,
    onSave,
    onCancel,
    onSubmit,
    getCurrentStep,
    value,
    setSubSectionIndex,
}: TTradingAssessmentNewUser) => {
    const handleCancel = (values: TFormData) => {
        const current_step = getCurrentStep() - 1;
        onSave(current_step, values);
        onCancel(current_step, goToPreviousStep);
    };

    const handleSubmit = (values: TFormData, actions: React.ReactNode, should_override: boolean) => {
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
        onSubmit(getCurrentStep() - 1, process_form_values, goToNextStep, null, should_override);
    };

    return (
        <TradingAssessmentForm
            form_value={value}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            setSubSectionIndex={setSubSectionIndex}
            disabled_items={disabled_items}
            class_name={''}
            should_move_to_next={false}
            is_independent_section={false}
        />
    );
};

export default TradingAssessmentNewUser;
