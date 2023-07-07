import React from 'react';
import classNames from 'classnames';
import { Formik, Field, FieldProps, Form } from 'formik';
import { reaction } from 'mobx';
import { Input, RadioGroup, Text, ThemedScrollbars } from '@deriv/components';
import { isDesktop, isMobile } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import FloatingRate from 'Components/floating-rate';
import { Localize, localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { ads } from 'Constants/ads';
import { buy_sell } from 'Constants/buy-sell';
import { ad_type } from 'Constants/floating-rate';
import { useStores } from 'Stores';
import { getHint } from 'Utils/adverts';
import CreateAdFormPaymentMethods from './create-ad-form-payment-methods';
import AdFormSubmit from '../ad-form-submit';
import AdFormWrapper from '../ad-form-wrapper';
import AdPaymentSelectionText from '../ad-payment-selection-text';
import AdSummary from '../ad-summary';
import './create-ad-form.scss';

type TFieldProps = {
    contact_info: string;
    default_advert_description: string;
    max_transaction: string;
    min_transaction: string;
    offer_amount: string;
    payment_info: string;
    rate_type: string;
    type: string;
};

const CreateAdForm = () => {
    const {
        client: { currency, local_currency_config },
    } = useStore();

    const { buy_sell_store, floating_rate_store, general_store, my_ads_store, my_profile_store } = useStores();
    const {
        float_rate_offset_limit,
        setApiErrorMessage: setFloatingRateApiErrorMessage,
        rate_type,
    } = floating_rate_store;
    const { advertiser_info, contact_info, default_advert_description, setP2PConfig } = general_store;
    const {
        current_method,
        getWebsiteStatus,
        handleSubmit,
        is_ad_created_modal_visible,
        payment_info,
        restrictDecimalPlace,
        restrictLength,
        setApiErrorMessage,
        setCurrentMethod,
        setShowAdForm,
        validateCreateAdForm,
    } = my_ads_store;
    const balance_available = advertiser_info?.balance_available;

    const [selected_methods, setSelectedMethods] = React.useState<string[]>([]);
    const { showModal, useRegisterModalProps } = useModalManagerContext();

    const handleSelectPaymentMethods = (selected_payment_methods: string[]) => {
        setSelectedMethods(selected_payment_methods);
    };

    // when adding payment methods in creating an ad, once user declines to save their payment method, flow is to close all add payment method modals
    useRegisterModalProps({
        key: 'CancelAddPaymentMethodModal',
        props: {
            should_hide_all_modals_on_cancel: true,
        },
    });

    const onCleanup = () => {
        setApiErrorMessage('');
        setFloatingRateApiErrorMessage('');
        setShowAdForm(false);
        buy_sell_store.setCreateSellAdFromNoAds(false);
    };

    React.useEffect(() => {
        setCurrentMethod({ key: null, is_deleted: false });
        my_profile_store.getPaymentMethodsList();
        my_profile_store.getAdvertiserPaymentMethods();
        const disposeApiErrorReaction = reaction(
            () => my_ads_store.api_error_message,
            () => {
                if (my_ads_store.api_error_message) showModal({ key: 'CreateAdErrorModal', props: {} });
            },
            { fireImmediately: true }
        );
        // P2P configuration is not subscribable. Hence need to fetch it on demand
        setP2PConfig();

        return () => {
            disposeApiErrorReaction();
            onCleanup();
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        const ad_website_status = setInterval(() => {
            if (is_ad_created_modal_visible) {
                getWebsiteStatus();
            }
        }, 10000);

        return () => {
            clearInterval(ad_website_status);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_ad_created_modal_visible]);

    const getTrailingComponent = (use_local_currency = false) => {
        return (
            <Text color={isDesktop() ? 'less-prominent' : 'prominent'} size={isDesktop() ? 'xxs' : 's'}>
                {use_local_currency ? local_currency_config.currency : currency}
            </Text>
        );
    };

    return (
        <React.Fragment>
            <Formik
                initialValues={
                    {
                        contact_info,
                        default_advert_description,
                        max_transaction: '',
                        min_transaction: '',
                        offer_amount: '',
                        payment_info,
                        rate_type: rate_type === ad_type.FLOAT ? '-0.01' : '',
                        type: buy_sell_store.create_sell_ad_from_no_ads ? buy_sell.SELL : buy_sell.BUY,
                    } as TFieldProps
                }
                onSubmit={handleSubmit}
                validate={validateCreateAdForm}
                initialErrors={{
                    offer_amount: '',
                }}
            >
                {({ errors, handleChange, setFieldValue, touched, values }) => {
                    const is_sell_advert = values.type === buy_sell.SELL;

                    const onChangeAdTypeHandler = (user_input: string) => {
                        if (rate_type === ad_type.FLOAT) {
                            setFieldValue('rate_type', user_input === buy_sell.SELL ? '-0.01' : '+0.01');
                        }
                        setFieldValue('type', user_input);
                    };

                    const getErrorMessages = (field: keyof TFieldProps, is_mandatory = true) => {
                        if (is_mandatory) {
                            return (touched[field] && errors[field]) || '';
                        }
                        return errors[field] ?? '';
                    };

                    const onChangeInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                        restrictLength(e, handleChange);
                    };

                    return (
                        <div className='create-ad-form'>
                            <Form noValidate>
                                <ThemedScrollbars
                                    className='create-ad-form__scrollbar'
                                    is_scrollbar_hidden={isMobile()}
                                >
                                    <AdFormWrapper>
                                        <div className='create-ad-form__scrollbar-container'>
                                            <Field name='type'>
                                                {({ field }: FieldProps) => (
                                                    <RadioGroup
                                                        {...field}
                                                        className='create-ad-form__radio-group'
                                                        name='type'
                                                        onToggle={event => onChangeAdTypeHandler(event.target.value)}
                                                        selected={values.type}
                                                        required
                                                    >
                                                        <RadioGroup.Item
                                                            value={buy_sell.BUY}
                                                            label={localize('Buy {{currency}}', { currency })}
                                                        />
                                                        <RadioGroup.Item
                                                            value={buy_sell.SELL}
                                                            label={localize('Sell {{currency}}', { currency })}
                                                        />
                                                    </RadioGroup>
                                                )}
                                            </Field>
                                            <AdSummary
                                                offer_amount={errors.offer_amount ? '' : values.offer_amount}
                                                price_rate={values.rate_type}
                                                type={values.type}
                                                ad_option={ads.CREATE}
                                            />

                                            <div className='create-ad-form__container'>
                                                <Field name='offer_amount'>
                                                    {({ field }: FieldProps) => (
                                                        <Input
                                                            {...field}
                                                            className={classNames('create-ad-form__field', {
                                                                'create-ad-form__offer-amt__sell-ad':
                                                                    values.type === buy_sell.SELL,
                                                            })}
                                                            data_testId='dt_offer_amount'
                                                            data-lpignore='true'
                                                            error={getErrorMessages('offer_amount')}
                                                            hint={getHint(is_sell_advert, balance_available, currency)}
                                                            is_relative_hint
                                                            label={localize('Total amount')}
                                                            onChange={onChangeInput}
                                                            required
                                                            trailing_icon={getTrailingComponent()}
                                                            type='text'
                                                        />
                                                    )}
                                                </Field>
                                                <Field name='rate_type'>
                                                    {({ field }: FieldProps) =>
                                                        rate_type === ad_type.FLOAT ? (
                                                            <FloatingRate
                                                                className='create-ad-form__field'
                                                                data_testid='dt_float_rate_type'
                                                                error_messages={errors.rate_type ?? ''}
                                                                fiat_currency={currency}
                                                                local_currency={local_currency_config.currency}
                                                                offset={{
                                                                    upper_limit: parseInt(float_rate_offset_limit),
                                                                    lower_limit: parseInt(float_rate_offset_limit) * -1,
                                                                }}
                                                                required
                                                                change_handler={(
                                                                    e: React.ChangeEvent<HTMLInputElement>
                                                                ) => {
                                                                    restrictDecimalPlace(e, handleChange);
                                                                }}
                                                                {...field}
                                                                onChange={handleChange}
                                                            />
                                                        ) : (
                                                            <Input
                                                                {...field}
                                                                className='create-ad-form__field'
                                                                data_testId='dt_fixed_rate_type'
                                                                data-lpignore='true'
                                                                error={getErrorMessages('rate_type')}
                                                                label={localize('Fixed rate (1 {{currency}})', {
                                                                    currency,
                                                                })}
                                                                onChange={onChangeInput}
                                                                required
                                                                trailing_icon={getTrailingComponent(true)}
                                                                type='text'
                                                            />
                                                        )
                                                    }
                                                </Field>
                                            </div>
                                            <div className='create-ad-form__container'>
                                                <Field name='min_transaction'>
                                                    {({ field }: FieldProps) => (
                                                        <Input
                                                            {...field}
                                                            className='create-ad-form__field'
                                                            data-lpignore='true'
                                                            data_testId='dt_min_transaction'
                                                            error={getErrorMessages('min_transaction')}
                                                            label={localize('Min order')}
                                                            onChange={onChangeInput}
                                                            required
                                                            trailing_icon={getTrailingComponent()}
                                                            type='text'
                                                        />
                                                    )}
                                                </Field>
                                                <Field name='max_transaction'>
                                                    {({ field }: FieldProps) => (
                                                        <Input
                                                            {...field}
                                                            className='create-ad-form__field'
                                                            data_testId='dt_max_transaction'
                                                            data-lpignore='true'
                                                            error={getErrorMessages('max_transaction')}
                                                            label={localize('Max order')}
                                                            onChange={onChangeInput}
                                                            required
                                                            trailing_icon={getTrailingComponent()}
                                                            type='text'
                                                        />
                                                    )}
                                                </Field>
                                            </div>
                                            {is_sell_advert && (
                                                <div className='create-ad-form__field--contact-details'>
                                                    <Field name='contact_info'>
                                                        {({ field }: FieldProps) => (
                                                            <Input
                                                                {...field}
                                                                className='create-ad-form__field create-ad-form__field--textarea'
                                                                data_testId='dt_contact_info'
                                                                data-lpignore='true'
                                                                error={getErrorMessages('contact_info')}
                                                                has_character_counter
                                                                initial_character_count={contact_info.length}
                                                                label={
                                                                    <Text color='less-prominent' size='xs'>
                                                                        <Localize i18n_default_text='Your contact details' />
                                                                    </Text>
                                                                }
                                                                max_characters={300}
                                                                required
                                                                type='textarea'
                                                            />
                                                        )}
                                                    </Field>
                                                </div>
                                            )}
                                            <Field name='default_advert_description'>
                                                {({ field }: FieldProps) => (
                                                    <Input
                                                        {...field}
                                                        className='create-ad-form__field create-ad-form__field--textarea'
                                                        data_testId='dt_default_advert_description'
                                                        data-lpignore='true'
                                                        error={getErrorMessages('default_advert_description', false)}
                                                        has_character_counter
                                                        hint={localize('This information will be visible to everyone.')}
                                                        initial_character_count={default_advert_description.length}
                                                        label={
                                                            <Text color='less-prominent' size='xs'>
                                                                <Localize i18n_default_text='Instructions (optional)' />
                                                            </Text>
                                                        }
                                                        max_characters={300}
                                                        required
                                                        type='textarea'
                                                    />
                                                )}
                                            </Field>
                                            <AdPaymentSelectionText is_sell_advert={is_sell_advert} />
                                            <CreateAdFormPaymentMethods
                                                onSelectPaymentMethods={handleSelectPaymentMethods}
                                                is_sell_advert={is_sell_advert}
                                            />
                                        </div>
                                        <AdFormSubmit
                                            ad_option={ads.CREATE}
                                            current_method={current_method}
                                            onCleanup={onCleanup}
                                            selected_methods={selected_methods}
                                        />
                                    </AdFormWrapper>
                                </ThemedScrollbars>
                            </Form>
                        </div>
                    );
                }}
            </Formik>
        </React.Fragment>
    );
};

export default observer(CreateAdForm);
