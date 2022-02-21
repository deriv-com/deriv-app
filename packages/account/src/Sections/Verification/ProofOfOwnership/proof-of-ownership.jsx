import classNames from 'classnames';
import React, { useState } from 'react';
import { Button, FormSubmitErrorMessage, Icon, Text } from '@deriv/components';
import { Formik } from 'formik';
import { localize } from '@deriv/translations';
import ExpandedCard from './ExpandedCard.jsx';
import FormFooter from '../../../Components/form-footer';
import FormBody from '../../../Components/form-body';
import FormSubHeader from '../../../Components/form-sub-header';
import FormBodySection from '../../../Components/form-body-section';

const ProofOfOwnership = () => {
    const [is_open, setIsOpen] = useState(false);
    const [step, setStep] = useState(0);

    const onClick = () => setIsOpen(!is_open);
    const icon = (
        <Icon
            icon={'IcChevronUpBold'}
            color='black'
            size={16}
            className={classNames('proof-of-ownership__card-item-icon', {
                'proof-of-ownership__card-item-icon--invert': !is_open,
            })}
        />
    );
    const Card = ({ handleChange, handleBlur, values, setFieldValue }) => (
        <div className={classNames('proof-of-ownership__card', { 'proof-of-ownership__card-open': is_open })}>
            <div className='proof-of-ownership__card-item'>
                <Icon icon='IcCreditCard' className='proof-of-ownership__card-item-logo' width={64} height={58} />
                <Text className='proof-of-ownership__card-item-text' as='p' color='general' size='s' weight='bold'>
                    {localize('Credit/debit card')}
                </Text>
                <Button
                    id='proof-of-ownership'
                    icon={icon}
                    className='proof-of-ownership__card-item-icon'
                    onClick={onClick}
                    transparent
                    data-testid={'proof-of-ownership-button'}
                />
            </div>
            {is_open && (
                <ExpandedCard
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    values={values}
                    setFieldValue={setFieldValue}
                />
            )}
        </div>
    );
    const initial_form = {
        cardNumber: '',
        file: null,
    };

    const handleSubmit = () => {
        console.log('hello');
    };
    const nextStep = () => {
        setStep(step + 1);
    };
    return (
        <Formik initialValues={initial_form} onSubmit={handleSubmit}>
            {({ values, errors, isValid, touched, handleChange, handleBlur, isSubmitting, setFieldValue }) => (
                <div className='proof-of-ownership'>
                    <FormBody>
                        <FormSubHeader title={localize('Please upload the following document.')} />
                        <FormBodySection>
                            <div>
                                <Card
                                    step={step}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                    values={values}
                                    setFieldValue={setFieldValue}
                                />
                            </div>
                        </FormBodySection>
                    </FormBody>
                    <FormFooter>
                        {status && status.msg && <FormSubmitErrorMessage message={status.msg} />}
                        <Button
                            type='button'
                            className={classNames('account-form__footer-btn')}
                            onClick={() => nextStep()}
                            // is_disabled={
                            //     isSubmitting || !dirty || is_btn_loading || Object.keys(errors).length > 0
                            // }
                            has_effect
                            // is_loading={is_btn_loading}
                            // is_submit_success={is_submit_success}
                            text={localize('Next')}
                            large
                            primary
                        />
                    </FormFooter>
                </div>
            )}
        </Formik>
    );
};

export default ProofOfOwnership;
