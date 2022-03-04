import classNames from 'classnames';
import React from 'react';
import { Button, FormSubmitErrorMessage } from '@deriv/components';
import { Formik } from 'formik';
import { localize } from '@deriv/translations';
import FormFooter from '../../../Components/form-footer';
import FormBody from '../../../Components/form-body';
import FormSubHeader from '../../../Components/form-sub-header';
import FormBodySection from '../../../Components/form-body-section';
import { isMobile } from '@deriv/shared';
import Card from './Card.jsx';

const getScrollOffset = () => {
    if (isMobile()) return '200px';
    return '80px';
};

const ProofOfOwnershipForm = ({ cards, handleSubmit, nextStep }) => {
    return (
        <Formik initialValues={cards} onSubmit={handleSubmit}>
            {({
                values,
                errors,
                // isValid,
                // touched,
                dirty,
                handleChange,
                handleBlur,
                // isSubmitting,
                setFieldValue,
                // submitForm,
            }) => (
                <div className='proof-of-ownership'>
                    <FormBody scroll_offset={getScrollOffset()}>
                        <FormSubHeader title={localize('Please upload the following document(s).')} />
                        <FormBodySection>
                            <fieldset>
                                {values.map((card, index) => {
                                    return (
                                        <Card
                                            type={card.payment_method_identifier}
                                            key={card.id}
                                            index={index}
                                            handleChange={handleChange}
                                            handleBlur={handleBlur}
                                            values={card}
                                            setFieldValue={setFieldValue}
                                        />
                                    );
                                })}
                            </fieldset>
                        </FormBodySection>
                    </FormBody>
                    <FormFooter>
                        {status?.msg && <FormSubmitErrorMessage message={status?.msg} />}
                        <Button
                            type='submit'
                            className={classNames('account-form__footer-btn')}
                            onClick={() => {
                                // submitForm()
                                nextStep();
                            }}
                            is_disabled={!dirty || Object.keys(errors).length > 0}
                            data-testid={'next-button'}
                            has_effect
                            // is_loading={is_btn_loading}
                            // is_submit_success={is_submit_success}
                            text={localize('Next')}
                            large
                            primary
                            form={'first-step'}
                        />
                    </FormFooter>
                </div>
            )}
        </Formik>
    );
};

export default ProofOfOwnershipForm;
