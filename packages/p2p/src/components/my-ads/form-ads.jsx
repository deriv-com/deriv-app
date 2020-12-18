import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Field, Form } from 'formik';
import { Dropdown, Loading, Icon, Input, Button, ThemedScrollbars } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { localize } from 'Components/i18next';
import PageReturn from 'Components/page-return/page-return.jsx';
import { useStores } from 'Stores';
import AdSummary from './my-ads-summary.jsx';
import { buy_sell } from '../../constants/buy-sell';

const FormAds = observer(() => {
    const { general_store, my_ads_store } = useStores();
    const { currency, local_currency_config } = general_store.client;

    React.useEffect(() => {
        my_ads_store.getAdvertiserInfo();
    }, []);

    const PageReturnComponent = () => {
        return <PageReturn onClick={() => my_ads_store.setShowAdForm(false)} page_title={localize('Create new ad')} />;
    };

    if (my_ads_store.is_form_loading) {
        return (
            <React.Fragment>
                <PageReturnComponent />
                <Loading is_fullscreen={false} />
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            <PageReturnComponent />
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
                validate={my_ads_store.validateFormAds}
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
                                        <AdSummary
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
                                                    hint={localize('Per 1 {{currency}}', {
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
                                        {my_ads_store.api_error_message && (
                                            <div className='p2p-my-ads__form-error'>
                                                <Icon icon='IcAlertDanger' />
                                                <div>{my_ads_store.api_error_message}</div>
                                            </div>
                                        )}
                                        <Button
                                            className='p2p-my-ads__form-button'
                                            secondary
                                            large
                                            onClick={() => my_ads_store.setShowAdForm(false)}
                                        >
                                            {localize('Cancel')}
                                        </Button>
                                        <Button
                                            className='p2p-my-ads__form-button'
                                            primary
                                            large
                                            is_disabled={isSubmitting || !isValid}
                                        >
                                            {localize('Post ad')}
                                        </Button>
                                    </div>
                                </ThemedScrollbars>
                            </Form>
                        </div>
                    );
                }}
            </Formik>
        </React.Fragment>
    );
});

FormAds.propTypes = {
    api_error_message: PropTypes.string,
    client: PropTypes.object,
    contact_info: PropTypes.string,
    default_advert_description: PropTypes.string,
    getAdvertiserInfo: PropTypes.func,
    handleSubmit: PropTypes.func,
    is_form_loading: PropTypes.bool,
    payment_info: PropTypes.string,
    restrictLength: PropTypes.func,
    setShowAdForm: PropTypes.func,
    validateFormAds: PropTypes.func,
};

export default FormAds;
