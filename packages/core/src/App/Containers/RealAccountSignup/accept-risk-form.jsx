import { Formik } from 'formik';
import React from 'react';
import {
    AutoHeightWrapper,
    Div100vhContainer,
    ThemedScrollbars,
    FormSubmitButton,
    Text,
    Modal,
} from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { isDesktop, isMobile } from '@deriv/shared';

const AcceptRiskForm = ({ onSubmit }) => {
    return (
        <Formik initialValues={{}} onSubmit={onSubmit} validateOnMount>
            {({ handleSubmit }) => (
                <AutoHeightWrapper default_height={200}>
                    {({ setRef, height }) => (
                        <form ref={setRef} onSubmit={handleSubmit} className='accept-risk__form'>
                            <Div100vhContainer className='details-form' height_offset='40px' is_disabled={isDesktop()}>
                                <ThemedScrollbars autoHide={!(window.innerHeight < 890)} height={height - 77}>
                                    <div className='accept-risk__container'>
                                        <div className='accept-risk__header'>
                                            <Text weight='bold' size='xs'>
                                                {localize('Warning')}
                                            </Text>
                                        </div>
                                        <Text as='p' size='xs'>
                                            <Localize
                                                i18n_default_text="Our products and services may expose you to risks that can be substantial at times, including the risk of losing your entire investment. Please note that by clicking <0>Continue</0>, you'll be accepting these risks."
                                                components={[<strong key={0} />]}
                                            />
                                        </Text>
                                    </div>
                                </ThemedScrollbars>
                            </Div100vhContainer>
                            <input name='accept_risk' value='1' type='hidden' />
                            <Modal.Footer has_separator is_bypassed={isMobile()}>
                                <FormSubmitButton is_absolute={isMobile()} label={localize('Continue')} />
                            </Modal.Footer>
                        </form>
                    )}
                </AutoHeightWrapper>
            )}
        </Formik>
    );
};

export default AcceptRiskForm;
