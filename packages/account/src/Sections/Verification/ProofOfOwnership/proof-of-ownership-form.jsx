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

const getScrollOffset = (itemsCount = 0) => {
    if (isMobile()) return '200px';
    if (itemsCount <= 2) return '0px';
    return '80px';
};

const ProofOfOwnershipForm = ({ cards, handleSubmit, nextStep }) => {
    const initValues = {};
    initValues.data = cards.map(item => {
        return { id: item.id, file: null };
    });
    return (
        <Formik initialValues={initValues} onSubmit={handleSubmit}>
            {({
                values,
                errors,
                // isValid,
                // touched,
                handleChange,
                handleBlur,
                // isSubmitting,
                setFieldValue,
                // submitForm,
            }) => (
                <div className='proof-of-ownership'>
                    <FormBody scroll_offset={getScrollOffset(cards.length)}>
                        <FormSubHeader title={localize('Please upload the following document(s).')} />
                        <FormBodySection>
                            <fieldset>
                                {cards.map((card, index) => {
                                    return (
                                        <Card
                                            key={card.id}
                                            index={index}
                                            handleChange={handleChange}
                                            handleBlur={handleBlur}
                                            values={values}
                                            card={card}
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
                            is_disabled={(() => {
                                const filesAvailable = values.data.some(item => item.file !== null);
                                return !filesAvailable || Object.keys(errors).length > 0;
                            })()}
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
