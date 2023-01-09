import React from 'react';
import IdvDocSubmitOnSignup from './idv-doc-submit-on-signup';
import { FormikValues } from 'formik';

type TProofOfIdentityFormOnSignup = {
    getCurrentStep: () => number;
    goToPreviousStep: () => void;
    goToNextStep: () => void;
    onCancel: (step: number, prev_step: () => void) => void;
    onSave: (step: number, values: object) => void;
    onSubmit: (step: number, values: object, action: FormikValues, next_step: () => void) => void;
    value: object;
    residence_list: object[];
    citizen: string;
};

export const ProofOfIdentityFormOnSignup = ({
    getCurrentStep,
    goToPreviousStep,
    goToNextStep,
    onCancel,
    onSave,
    onSubmit,
    value,
    residence_list,
    citizen,
}: TProofOfIdentityFormOnSignup) => {
    const citizen_data = residence_list.find((residence: FormikValues) => residence.value === citizen) || {};

    const handleSubmit = (values: FormikValues, actions: FormikValues) => {
        onSubmit(getCurrentStep() - 1, values, actions.setSubmitting, goToNextStep);
    };

    const handleCancel = (values: FormikValues) => {
        const current_step = getCurrentStep() - 1;
        onSave(current_step, values);
        onCancel(current_step, goToPreviousStep);
    };
    return (
        <IdvDocSubmitOnSignup
            citizen_data={citizen_data}
            value={value}
            has_previous={true}
            onPrevious={handleCancel}
            onNext={handleSubmit}
        />
    );
};
