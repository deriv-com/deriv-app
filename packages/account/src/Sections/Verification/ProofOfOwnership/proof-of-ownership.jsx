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
import { isMobile } from '@deriv/shared';

export const Card = ({ handleChange, handleBlur, values, setFieldValue }) => {
    const onClick = () => setIsOpen(!is_open);
    const [is_open, setIsOpen] = useState(false);
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
    return (
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
};
const CARDS_COUNT = 10;
const CARD_VALUE = {
    cardNumber: '',
    file: null,
};
const initial_form = {
    cardsCount: '',
    cards: [],
};
const ProofOfOwnership = () => {
    const getScrollOffset = () => {
        if (isMobile()) return '200px';
        return '80px';
    };
    const cardsGenerator = () => {
        const cards_arr = [];
        for (let i = 0; i < CARDS_COUNT; i++) {
            cards_arr[i] = CARD_VALUE;
        }
        return cards_arr;
    };
    const [cards] = useState(cardsGenerator());
    const [step, setStep] = useState(0);

    const handleSubmit = e => {
        console.log('hello', e);
    };
    const nextStep = () => {
        setStep(step + 1);
    };
    return (
        <Formik initialValues={initial_form} onSubmit={handleSubmit}>
            {({
                values,
                errors,
                isValid,
                touched,
                dirty,
                handleChange,
                handleBlur,
                isSubmitting,
                setFieldValue,
                submitForm,
            }) => (
                <div className='proof-of-ownership'>
                    <FormBody scroll_offset={getScrollOffset()}>
                        <FormSubHeader title={localize('Please upload the following document.')} />
                        <FormBodySection>
                            <fieldset>
                                {cards.map((card, index) => {
                                    return (
                                        <Card
                                            key={index}
                                            step={step}
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
                        {status && status.msg && <FormSubmitErrorMessage message={status.msg} />}
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

export default ProofOfOwnership;
