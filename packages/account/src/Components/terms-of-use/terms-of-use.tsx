import { Field, Formik, FormikValues } from 'formik';
import React, { HtmlHTMLAttributes } from 'react';
import cn from 'classnames';
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
import CheckboxField from './checkbox-field';
import { SharedMessage, BrokerSpecificMessage, Hr } from './terms-of-use-messages';
import './terms-of-use.scss';
import { TPlatformContext } from 'Types';

type TTermsOfUseExtend = {
    getCurrentStep: () => number;
    goToPreviousStep: () => void;
    goToNextStep: () => void;
    onCancel: (current_step: number, goToPreviousStep: () => void) => void;
    onSubmit: (
        current_step: number | null,
        values: FormikValues,
        action: (isSubmitting: boolean) => void,
        next_step: () => void
    ) => void;
    real_account_signup_target: string;
    value: FormikValues;
    form_error: string;
    isDesktop?: string | number | undefined;
};

type TTermsOfUse = HtmlHTMLAttributes<HTMLInputElement | HTMLLabelElement> & TTermsOfUseExtend;

const TermsOfUse = ({
    onCancel,
    getCurrentStep,
    goToPreviousStep,
    goToNextStep,
    onSubmit,
    value,
    real_account_signup_target,
    ...props
}: TTermsOfUse) => {
    const { is_appstore }: Partial<TPlatformContext> = React.useContext(PlatformContext);

    const handleCancel = () => {
        const current_step = getCurrentStep() - 1;
        onCancel(current_step, goToPreviousStep);
    };
    const getSubmitButtonLabel = () => {
        if (is_appstore) {
            return localize('Finish');
        }
        return localize('Add account');
    };

    return (
        <Formik
            initialValues={value}
            onSubmit={(values, actions) => {
                onSubmit(getCurrentStep() - 1, {}, actions.setSubmitting, goToNextStep);
            }}
        >
            {({ handleSubmit, values, isSubmitting }) => (
                <AutoHeightWrapper default_height={380} height_offset={isDesktop() ? 81 : null}>
                    {({ setRef }: { setRef: string }) => (
                        <form ref={setRef} onSubmit={handleSubmit}>
                            <Div100vhContainer
                                className='details-form'
                                height_offset={is_appstore ? '242px' : '110px'}
                                is_disabled={isDesktop()}
                            >
                                <ThemedScrollbars>
                                    <div
                                        className={cn('details-form__elements', 'terms-of-use')}
                                        style={{ paddingBottom: isDesktop() ? 'unset' : '0' }}
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
                                                        <StaticUrl
                                                            key={0}
                                                            className='link'
                                                            href='/terms-and-conditions'
                                                        />,
                                                    ]}
                                                />
                                            }
                                        />
                                    </div>
                                </ThemedScrollbars>
                            </Div100vhContainer>
                            <Modal.Footer has_separator is_bypassed={isMobile()}>
                                <FormSubmitButton
                                    is_disabled={isSubmitting || !values.agreed_tos || !values.agreed_tnc}
                                    label={getSubmitButtonLabel()}
                                    has_cancel
                                    is_absolute={isMobile()}
                                    onCancel={() => handleCancel()}
                                    cancel_label={localize('Previous')}
                                    form_errors={props.form_error}
                                />
                                console.log(agreed_tnc)
                            </Modal.Footer>
                        </form>
                    )}
                </AutoHeightWrapper>
            )}
        </Formik>
    );
};

export default TermsOfUse;
