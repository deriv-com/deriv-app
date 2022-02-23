import classNames from 'classnames';
import React, { useState } from 'react';
import { Button, FormSubmitErrorMessage } from '@deriv/components';
import { Formik } from 'formik';
import { localize } from '@deriv/translations';
import FormFooter from '../../../Components/form-footer';
import FormBody from '../../../Components/form-body';
import FormSubHeader from '../../../Components/form-sub-header';
import FormBodySection from '../../../Components/form-body-section';
import { isMobile } from '@deriv/shared';
import Card from './Card.jsx';

const CARDS_COUNT = 10;
const CARD_VALUE = {
    static_data: {
        cardTitle: '',
        icon: 'IcCreditCard',
    },
    data: {
        cardNumber: '',
        file: null,
    },
};

const getScrollOffset = () => {
    if (isMobile()) return '200px';
    return '80px';
};

const ProofOfOwnership = () => {
    const cardsGenerator = () => {
        const cards_arr = [];
        for (let i = 0; i < CARDS_COUNT; i++) {
            cards_arr[i] = CARD_VALUE;
        }
        return { cards: cards_arr };
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
        <Formik initialValues={cards} onSubmit={handleSubmit}>
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
                                {values.cards.map((card, index) => {
                                    return (
                                        <Card
                                            key={card.cardTitle}
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

export default ProofOfOwnership;
