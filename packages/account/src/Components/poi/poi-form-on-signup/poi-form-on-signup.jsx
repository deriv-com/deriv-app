import React from 'react';
import PropTypes from 'prop-types';
import IdvDocSubmitOnSignup from './idv-doc-submit-on-signup';

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
}) => {
    const citizen_data = residence_list.find(residence => residence.value === citizen);

    const handleSubmit = (values, actions) => {
        onSubmit(getCurrentStep() - 1, values, actions.setSubmitting, goToNextStep);
    };

    const handleCancel = values => {
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

ProofOfIdentityFormOnSignup.propTypes = {
    onCancel: PropTypes.func,
    onSave: PropTypes.func,
    onSubmit: PropTypes.func,
    value: PropTypes.object,
    getCurrentStep: PropTypes.func,
    goToPreviousStep: PropTypes.func,
    goToNextStep: PropTypes.func,
    residence_list: PropTypes.arrayOf(PropTypes.object),
    citizen: PropTypes.string,
};
