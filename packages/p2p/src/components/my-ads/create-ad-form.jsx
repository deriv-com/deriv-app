import * as React from 'react';
import { Formik, Field, Form } from 'formik';
import { Button, Dropdown, Input, Modal, Text, ThemedScrollbars } from '@deriv/components';
import { reaction } from 'mobx';
import { observer } from 'mobx-react-lite';
import { Localize, localize } from 'Components/i18next';
import { buy_sell } from 'Constants/buy-sell';
import { useStores } from 'Stores';
import CreateAdSummary from './create-ad-summary.jsx';

const CreateAdForm = () => {
    const { general_store, my_ads_store } = useStores();
    const { currency, local_currency_config } = general_store.client;
    const [is_api_error_modal_visible, setIsApiErrorModalVisible] = React.useState(false);

    React.useEffect(() => {
        const disposeApiErrorReaction = reaction(
            () => my_ads_store.api_error_message,
            () => setIsApiErrorModalVisible(!!my_ads_store.api_error_message)
        );

        return () => {
            disposeApiErrorReaction();
            my_ads_store.setApiErrorMessage('');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <React.Fragment>
            <Formik
                initialValues={{
                    contact_info: my_ads_store.contact_info,
                    default_advert_description: my_ads_store.default_advert_description,
                    max_transaction: '',
                    min_transaction: '',
                    offer_amount: '',
                    payment_info: my_ads_store.payment_info,
                    price_rate: '',
                    type: 'buy',
                }}
                onSubmit={my_ads_store.handleSubmit}
                validate={my_ads_store.validateCreateAdForm}
                initialErrors={{
                    // Pass one error to ensure Post ad button is disabled initially.
                    offer_amount: true,
                }}
            >
                {({ errors, handleChange, isSubmitting, isValid, touched, values }) => {
                    const is_sell_advert = values.type === 'sell';
                    return (
                        <div className='p2p-my-ads__form'>
                            <Form noValidate>
                                <ThemedScrollbars className='p2p-my-ads__form-scrollbar'>
                                    <div className='p2p-my-ads__form-summary'>
                                        <CreateAdSummary
                                            offer_amount={errors.offer_amount ? '' : values.offer_amount}
                                            price_rate={errors.price_rate ? '' : values.price_rate}
                                            type={values.type}
                                        />
                                    </div>
                                    <div className='p2p-my-ads__form-container'>
                                        <Field name='type'>
                                            {({ field }) => (
                                                <Dropdown
                                                    {...field}
                                                    placeholder={localize('Type')}
                                                    is_align_text_left
                                                    className='p2p-my-ads__form-field'
                                                    list={[
                                                        { text: localize('Buy'), value: buy_sell.BUY },
                                                        { text: localize('Sell'), value: buy_sell.SELL },
                                                    ]}
                                                    error={touched.type && errors.type}
                                                />
                                            )}
                                        </Field>
                                        <Field name='offer_amount'>
                                            {({ field }) => (
                                                <Input
                                                    {...field}
                                                    data-lpignore='true'
                                                    type='text'
                                                    error={touched.offer_amount && errors.offer_amount}
                                                    label={localize('Total amount')}
                                                    className='p2p-my-ads__form-field'
                                                    trailing_icon={
                                                        <span className='p2p-my-ads__form-field--trailing'>
                                                            {currency}
                                                        </span>
                                                    }
                                                    onChange={e => {
                                                        my_ads_store.restrictLength(e, handleChange);
                                                    }}
                                                    required
                                                />
                                            )}
                                        </Field>
                                    </div>
                                    <div className='p2p-my-ads__form-container'>
                                        <Field name='price_rate'>
                                            {({ field }) => (
                                                <Input
                                                    {...field}
                                                    data-lpignore='true'
                                                    type='text'
                                                    error={touched.price_rate && errors.price_rate}
                                                    label={localize('Fixed rate (1 {{currency}})', {
                                                        currency,
                                                    })}
                                                    className='p2p-my-ads__form-field'
                                                    trailing_icon={
                                                        <span className='p2p-my-ads__form-field--trailing'>
                                                            {local_currency_config.currency}
                                                        </span>
                                                    }
                                                    onChange={e => {
                                                        my_ads_store.restrictLength(e, handleChange);
                                                    }}
                                                    required
                                                />
                                            )}
                                        </Field>
                                        <Field name='min_transaction'>
                                            {({ field }) => (
                                                <Input
                                                    {...field}
                                                    data-lpignore='true'
                                                    type='text'
                                                    error={touched.min_transaction && errors.min_transaction}
                                                    label={localize('Min order')}
                                                    className='p2p-my-ads__form-field'
                                                    trailing_icon={
                                                        <span className='p2p-my-ads__form-field--trailing'>
                                                            {currency}
                                                        </span>
                                                    }
                                                    onChange={e => {
                                                        my_ads_store.restrictLength(e, handleChange);
                                                    }}
                                                    required
                                                />
                                            )}
                                        </Field>
                                        <Field name='max_transaction'>
                                            {({ field }) => (
                                                <Input
                                                    {...field}
                                                    data-lpignore='true'
                                                    type='text'
                                                    error={touched.max_transaction && errors.max_transaction}
                                                    label={localize('Max order')}
                                                    className='p2p-my-ads__form-field'
                                                    trailing_icon={
                                                        <span className='p2p-my-ads__form-field--trailing'>
                                                            {currency}
                                                        </span>
                                                    }
                                                    onChange={e => {
                                                        my_ads_store.restrictLength(e, handleChange);
                                                    }}
                                                    required
                                                />
                                            )}
                                        </Field>
                                    </div>
                                    {is_sell_advert && (
                                        <Field name='payment_info'>
                                            {({ field }) => (
                                                <Input
                                                    {...field}
                                                    data-lpignore='true'
                                                    type='textarea'
                                                    label={localize('Your payment details')}
                                                    error={touched.payment_info && errors.payment_info}
                                                    hint={localize('e.g. your bank/e-wallet account details')}
                                                    className='p2p-my-ads__form-field p2p-my-ads__form-field--textarea'
                                                    initial_character_count={my_ads_store.payment_info.length}
                                                    required
                                                    has_character_counter
                                                    max_characters={300}
                                                />
                                            )}
                                        </Field>
                                    )}
                                    {is_sell_advert && (
                                        <Field name='contact_info'>
                                            {({ field }) => (
                                                <Input
                                                    {...field}
                                                    data-lpignore='true'
                                                    type='textarea'
                                                    label={localize('Your contact details')}
                                                    error={touched.contact_info && errors.contact_info}
                                                    className='p2p-my-ads__form-field p2p-my-ads__form-field--textarea'
                                                    initial_character_count={my_ads_store.contact_info.length}
                                                    required
                                                    has_character_counter
                                                    max_characters={300}
                                                />
                                            )}
                                        </Field>
                                    )}
                                    <Field name='default_advert_description'>
                                        {({ field }) => (
                                            <Input
                                                {...field}
                                                data-lpignore='true'
                                                type='textarea'
                                                error={
                                                    touched.default_advert_description &&
                                                    errors.default_advert_description
                                                }
                                                label={localize('Instructions (optional)')}
                                                hint={localize('This information will be visible to everyone')}
                                                className='p2p-my-ads__form-field p2p-my-ads__form-field--textarea'
                                                initial_character_count={my_ads_store.default_advert_description.length}
                                                has_character_counter
                                                max_characters={300}
                                                required
                                            />
                                        )}
                                    </Field>
                                    <div className='p2p-my-ads__form-container p2p-my-ads__form-footer'>
                                        <Button
                                            className='p2p-my-ads__form-button'
                                            secondary
                                            large
                                            onClick={() => my_ads_store.setShowAdForm(false)}
                                            type='button'
                                        >
                                            <Localize i18n_default_text='Cancel' />
                                        </Button>
                                        <Button
                                            className='p2p-my-ads__form-button'
                                            primary
                                            large
                                            is_disabled={isSubmitting || !isValid}
                                        >
                                            <Localize i18n_default_text='Post ad' />
                                        </Button>
                                    </div>
                                </ThemedScrollbars>
                            </Form>
                        </div>
                    );
                }}
            </Formik>
            <Modal
                className='p2p-my-ads__modal-error'
                is_open={is_api_error_modal_visible}
                small
                has_close_icon={false}
                title={localize('Something’s not right')}
            >
                <Modal.Body>
                    <Text as='p' size='xs' color='prominent'>
                        {my_ads_store.api_error_message}
                    </Text>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        has_effect
                        text={localize('Ok')}
                        onClick={() => setIsApiErrorModalVisible(false)}
                        primary
                        large
                    />
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

export default observer(CreateAdForm);
