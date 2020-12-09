import PropTypes from 'prop-types';
import React from 'react';
import { Formik, Form } from 'formik';
import { Div100vhContainer, Modal, FormSubmitButton, Text } from '@deriv/components';
import { isDesktop } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';

const BriefModal = ({
    disableApp,
    enableApp,
    IntervalField,
    is_visible,
    logout,
    onSubmit,
    openStatement,
    validateForm,
}) => {
    return (
        <Modal
            className='reality-check'
            enableApp={enableApp}
            is_open={is_visible}
            disableApp={disableApp}
            has_close_icon={false}
            title={localize('Trading statistics report')}
            portalId='modal_root_absolute'
            width='720px'
        >
            <Formik
                initialValues={{
                    interval: '',
                }}
                validate={validateForm}
                onSubmit={onSubmit}
            >
                {({ errors, isSubmitting, isValid, values, touched, handleChange, handleBlur }) => (
                    <Form noValidate>
                        <Modal.Body>
                            <Div100vhContainer
                                className='reality-check__wrapper'
                                max_autoheight_offset='204px'
                                is_disabled={isDesktop()}
                            >
                                <Text
                                    as='p'
                                    size='xs'
                                    line_height='m'
                                    className='reality-check__text reality-check__text--description'
                                >
                                    <Localize i18n_default_text='Options trading can become a real addiction, as can any other activity pushed to its limits. To avoid the danger of such an addiction, we provide a reality-check that gives you a summary of your trades and accounts on a regular basis.' />
                                </Text>
                                <Text
                                    as='p'
                                    size='xs'
                                    line_height='m'
                                    className='reality-check__text reality-check__text--description'
                                >
                                    <Localize
                                        i18n_default_text='Would like to check your statement first? <0>Check Statement</0>'
                                        components={[<a key={0} className='link' onClick={openStatement} />]}
                                    />
                                </Text>

                                <div className='reality-check__separator reality-check__separator--large' />

                                <Text
                                    as='p'
                                    size='xs'
                                    line_height='m'
                                    align='center'
                                    className='reality-check__text reality-check__text--center'
                                >
                                    <Localize i18n_default_text='Please specify your preferred interval reality check in minutes:' />
                                </Text>

                                <IntervalField
                                    values={values}
                                    touched={touched}
                                    errors={errors}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                />
                            </Div100vhContainer>
                        </Modal.Body>
                        <Modal.Footer has_separator>
                            <FormSubmitButton
                                className='reality-check__submit'
                                has_cancel
                                cancel_label={localize('Log out')}
                                is_disabled={!values.interval || !isValid || isSubmitting}
                                label={localize('Continue trading')}
                                onCancel={logout}
                            />
                        </Modal.Footer>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};

BriefModal.propTypes = {
    disableApp: PropTypes.func,
    enableApp: PropTypes.func,
    IntervalField: PropTypes.func,
    is_visible: PropTypes.bool,
    logout: PropTypes.func,
    onSubmit: PropTypes.func,
    openStatement: PropTypes.func,
    validateForm: PropTypes.func,
};

export default BriefModal;
