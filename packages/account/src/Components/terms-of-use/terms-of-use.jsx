import { Field, Formik } from 'formik';
import React from 'react';
import {
    Div100vhContainer,
    Modal,
    ThemedScrollbars,
    FormSubmitButton,
    AutoHeightWrapper,
    StaticUrl,
} from '@deriv/components';
import { isDesktop, isMobile, PlatformContext } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import CheckboxField from './checkbox-field.jsx';
import { SharedMessage, BrokerSpecificMessage, Hr } from './terms-of-use-messages.jsx';
import './terms-of-use.scss';

const TermsOfUse = ({
    getCurrentStep,
    onCancel,
    goToPreviousStep,
    goToNextStep,
    onSubmit,
    value,
    real_account_signup_target,
    ...props
}) => {
    const { is_dashboard } = React.useContext(PlatformContext);

    const handleCancel = () => {
        const current_step = getCurrentStep() - 1;
        onCancel(current_step, goToPreviousStep);
    };

    const getSubmitButtonLabel = () => {
        if (is_dashboard) {
            return localize('Finish');
        }
        return localize('Add account');
    };

    return (
        <Formik
            initialValues={value}
            onSubmit={(values, actions) => {
                onSubmit(getCurrentStep() - 1, values.agreed_tos, actions.setSubmitting, goToNextStep);
            }}
        >
            {({ handleSubmit, values, isSubmitting }) => (
                <AutoHeightWrapper default_height={200}>
                    {({ setRef, height }) => (
                        <form ref={setRef} onSubmit={handleSubmit}>
                            <ThemedScrollbars is_bypassed={isMobile()} height={height - 72}>
                                <Div100vhContainer
                                    className='terms-of-use'
                                    height_offset={is_dashboard ? '242px' : '110px'}
                                    is_disabled={isDesktop()}
                                >
                                    <BrokerSpecificMessage target={real_account_signup_target} />
                                    <Hr />
                                    <SharedMessage />
                                    <Field
                                        component={CheckboxField}
                                        className='terms-of-use__checkbox'
                                        name='agreed_tos'
                                        id='agreed_tos'
                                        label={localize(
                                            'I am not a PEP, and I have not been a PEP in the last 12 months.'
                                        )}
                                    />
                                    <Hr />
                                    <Field
                                        component={CheckboxField}
                                        className='terms-of-use__checkbox'
                                        name='agreed_tnc'
                                        id='agreed_tnc'
                                        label={
                                            <Localize
                                                i18n_default_text='I agree to the <0>terms and conditions</0>.'
                                                components={[
                                                    <StaticUrl key={0} className='link' href='/terms-and-conditions' />,
                                                ]}
                                            />
                                        }
                                    />
                                </Div100vhContainer>
                            </ThemedScrollbars>
                            <Modal.Footer has_separator is_bypassed={isMobile()}>
                                <FormSubmitButton
                                    is_disabled={isSubmitting || !values.agreed_tos || !values.agreed_tnc}
                                    label={getSubmitButtonLabel()}
                                    has_cancel
                                    is_absolute={isMobile()}
                                    onCancel={() => handleCancel()}
                                    cancel_label={localize('Previous')}
                                    form_error={props.form_error}
                                />
                            </Modal.Footer>
                        </form>
                    )}
                </AutoHeightWrapper>
            )}
        </Formik>
    );
};

export default TermsOfUse;
