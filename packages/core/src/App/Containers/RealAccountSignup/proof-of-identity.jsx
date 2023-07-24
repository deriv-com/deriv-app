import { AutoHeightWrapper, FormSubmitButton } from '@deriv/components';

import { Formik } from 'formik';
import ProofOfIdentityContainer from '@deriv/account';
import PropTypes from 'prop-types';
import React from 'react';
import { isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';

const ProofOfIdentityForm = ({ form_error, index, onCancel, onSubmit, value }) => {
    const [poi_state, setPoiState] = React.useState('none');

    const validateForm = () => {
        const errors = {};
        if (!['pending', 'verified'].includes(poi_state)) {
            errors.poi_state = true;
        }

        return errors;
    };

    return (
        <Formik
            initialValues={value}
            validate={validateForm}
            onSubmit={actions => onSubmit(index, { poi_state }, actions.setSubmitting)}
        >
            {({ handleSubmit }) => (
                <AutoHeightWrapper default_height={200}>
                    {({ setRef, height }) => (
                        <form ref={setRef} className='cfd-proof-of-identity' onSubmit={handleSubmit}>
                            <div className='details-form'>
                                <input type='hidden' name='poi_state' value={poi_state} readOnly />
                                <ProofOfIdentityContainer
                                    height={height}
                                    onStateChange={() => setPoiState({ status })}
                                    is_from_external={true}
                                />
                                <FormSubmitButton
                                    has_cancel
                                    cancel_label={localize('Previous')}
                                    is_disabled={!['pending', 'verified'].includes(poi_state)}
                                    is_absolute={isMobile()}
                                    label={localize('Next')}
                                    onCancel={onCancel}
                                    form_error={form_error}
                                />
                            </div>
                        </form>
                    )}
                </AutoHeightWrapper>
            )}
        </Formik>
    );
};

ProofOfIdentityForm.propTypes = {
    form_error: PropTypes.string,
    index: PropTypes.number,
    onCancel: PropTypes.func,
    onSubmit: PropTypes.func,
    value: PropTypes.object,
};

export default ProofOfIdentityForm;
