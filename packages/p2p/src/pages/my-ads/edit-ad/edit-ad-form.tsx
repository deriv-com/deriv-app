import React from 'react';
import classNames from 'classnames';
import { Field, FieldProps, Form, Formik } from 'formik';
import { Input, Loading, Text, ThemedScrollbars } from '@deriv/components';
import { isDesktop, isMobile } from '@deriv/shared';
import { observer } from '@deriv/stores';
import FloatingRate from 'Components/floating-rate';
import { Localize, localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import PageReturn from 'Components/page-return';
import { ads } from 'Constants/ads';
import { buy_sell } from 'Constants/buy-sell';
import { ad_type } from 'Constants/floating-rate';
import { useStores } from 'Stores';
import { getHint } from 'Utils/adverts';
import EditAdFormPaymentMethods from './edit-ad-form-payment-methods';
import AdFormSubmit from '../ad-form-submit';
import AdFormWrapper from '../ad-form-wrapper';
import AdPaymentSelectionText from '../ad-payment-selection-text';
import AdSummary from '../ad-summary';
import './edit-ad-form.scss';

type TFieldProps = {
    contact_info: string;
    description: string;
    max_transaction: string;
    min_transaction: string;
    offer_amount: string;
    rate_type: string;
    type: string;
};

const EditAdForm = () => {
    const { floating_rate_store, general_store, my_ads_store, my_profile_store } = useStores();

    const {
        current_method,
        p2p_advert_information,
        selected_ad_type,
        setApiErrorCode,
        setEditAdFormError,
        setShowEditAdForm,
        restrictLength,
        required_ad_type,
    } = my_ads_store;

    const {
        account_currency,
        amount_display,
        contact_info,
        description,
        is_active,
        local_currency,
        max_order_amount_display,
        min_order_amount_display,
        payment_method_names,
        payment_method_details,
        rate_display,
        rate_type,
        type,
    } = p2p_advert_information;

    const {
        getAdvertiserPaymentMethods,
        getPaymentMethodDisplayName,
        getPaymentMethodsList,
        getPaymentMethodValue,
        payment_method_value,
    } = my_profile_store;

    const { advertiser_info, setP2PConfig } = general_store;
    const { balance_available } = advertiser_info;

    const {
        float_rate_offset_limit,
        setApiErrorMessage,
        rate_type: floating_rate_type,
        reached_target_date,
    } = floating_rate_store;

    const is_buy_advert = type === buy_sell.BUY;
    const [selected_methods, setSelectedMethods] = React.useState<string[]>([]);
    const [is_payment_method_touched, setIsPaymentMethodTouched] = React.useState(false);
    const { showModal, useRegisterModalProps } = useModalManagerContext();

    // when editing payment methods in creating an ad, once user declines to save their payment method, flow is to close all add payment method modals
    useRegisterModalProps({
        key: 'CancelAddPaymentMethodModal',
        props: {
            should_hide_all_modals_on_cancel: true,
        },
    });

    const setInitialAdRate = () => {
        if (required_ad_type !== selected_ad_type) {
            if (required_ad_type === ad_type.FLOAT) {
                return is_buy_advert ? '-0.01' : '+0.01';
            }
            return '';
        }
        return rate_display;
    };

    const payment_methods_changed = is_buy_advert
        ? !(
              !!payment_method_names &&
              selected_methods?.every(pm => {
                  const method = getPaymentMethodDisplayName(pm);
                  return payment_method_names.includes(method);
              }) &&
              selected_methods.length === payment_method_names.length
          )
        : !(
              !!payment_method_details &&
              selected_methods.every(pm => Object.keys(payment_method_details).includes(pm)) &&
              selected_methods.length === Object.keys(payment_method_details).length
          );

    const handleEditAdFormCancel = (is_form_edited: boolean) => {
        if (is_form_edited || payment_methods_changed) {
            showModal({ key: 'EditAdCancelModal', props: {} });
        } else {
            setShowEditAdForm(false);
        }
    };

    React.useEffect(() => {
        getPaymentMethodsList();
        getAdvertiserPaymentMethods();
        setEditAdFormError('');
        setApiErrorMessage('');
        // P2P configuration is not subscribed. Hence need to fetch it on demand
        setP2PConfig();

        if (payment_method_names && !payment_method_details) {
            const selected_payment_method_values: string[] = [];
            payment_method_names?.forEach((payment_method: string) => {
                getPaymentMethodValue(payment_method);
                if (payment_method_value) {
                    selected_payment_method_values.push(payment_method_value);
                    my_ads_store.payment_method_names.push(payment_method_value);
                }
            });
            setSelectedMethods(selected_payment_method_values);
        }
        if (payment_method_details) {
            Object.entries(payment_method_details)?.map(pm => {
                selected_methods.push(pm[0]);
                my_ads_store.payment_method_ids.push(pm[0]);
            });
        }
        if (required_ad_type !== rate_type) {
            const is_payment_method_available =
                !!Object.keys({ ...payment_method_details }).length ||
                !!Object.values({ ...payment_method_names }).length;
            setIsPaymentMethodTouched(is_payment_method_available);
        }
        return () => {
            setApiErrorCode(null);
            setShowEditAdForm(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getTrailingComponent = (use_local_currency = false) => {
        return (
            <Text color={isDesktop() ? 'less-prominent' : 'prominent'} size={isDesktop() ? 'xxs' : 's'}>
                {use_local_currency ? local_currency : account_currency}
            </Text>
        );
    };

    return (
        <React.Fragment>
            {floating_rate_store.is_loading ? (
                <Loading is_fullscreen={false} />
            ) : (
                <React.Fragment>
                    <PageReturn
                        onClick={() => setShowEditAdForm(false)}
                        page_title={localize('Edit {{ad_type}} ad', { ad_type: type })}
                    />
                    <Formik
                        initialValues={
                            {
                                contact_info,
                                description,
                                max_transaction: max_order_amount_display,
                                min_transaction: min_order_amount_display,
                                offer_amount: amount_display,
                                rate_type: setInitialAdRate(),
                                type,
                                is_active: rate_type !== floating_rate_type && reached_target_date ? 1 : is_active,
                            } as TFieldProps
                        }
                        onSubmit={my_ads_store.onClickSaveEditAd}
                        validate={my_ads_store.validateEditAdForm}
                        validateOnMount
                    >
                        {({ dirty, errors, handleChange, touched, values }) => {
                            const is_sell_advert = values.type === buy_sell.SELL;
                            // Form should not be checked for value change when ad switch is triggered
                            const check_dirty =
                                required_ad_type === rate_type
                                    ? dirty || is_payment_method_touched
                                    : is_payment_method_touched;

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
                                <div className='edit-ad-form'>
                                    <Form noValidate>
                                        <ThemedScrollbars
                                            className='edit-ad-form__scrollbar'
                                            is_scrollbar_hidden={isMobile()}
                                        >
                                            <AdFormWrapper>
                                                <div className='edit-ad-form__scrollbar-container'>
                                                    <div className='edit-ad-form__summary'>
                                                        <AdSummary
                                                            offer_amount={
                                                                errors.offer_amount ? '' : values.offer_amount
                                                            }
                                                            price_rate={values.rate_type}
                                                            type={values.type}
                                                            ad_option={ads.EDIT}
                                                        />
                                                    </div>
                                                    <div className='edit-ad-form__container'>
                                                        <Field name='offer_amount'>
                                                            {({ field }: FieldProps) => (
                                                                <Input
                                                                    {...field}
                                                                    className={classNames(
                                                                        'edit-ad-form__field',
                                                                        'edit-ad-form__offer-amt'
                                                                    )}
                                                                    data_testId='dt_offer_amount'
                                                                    data-lpignore='true'
                                                                    disabled
                                                                    error={getErrorMessages('offer_amount')}
                                                                    hint={getHint(
                                                                        is_sell_advert,
                                                                        balance_available,
                                                                        account_currency
                                                                    )}
                                                                    is_relative_hint
                                                                    label={localize('Total amount')}
                                                                    onChange={onChangeInput}
                                                                    trailing_icon={getTrailingComponent()}
                                                                    type='text'
                                                                />
                                                            )}
                                                        </Field>
                                                        <Field name='rate_type'>
                                                            {({ field }: FieldProps) =>
                                                                required_ad_type === ad_type.FLOAT ? (
                                                                    <FloatingRate
                                                                        className='edit-ad-form__field'
                                                                        data_testid='dt_float_rate_type'
                                                                        error_messages={errors.rate_type ?? ''}
                                                                        fiat_currency={account_currency}
                                                                        local_currency={local_currency}
                                                                        required
                                                                        change_handler={e => {
                                                                            my_ads_store.restrictDecimalPlace(
                                                                                e,
                                                                                handleChange
                                                                            );
                                                                        }}
                                                                        {...field}
                                                                    />
                                                                ) : (
                                                                    <Input
                                                                        {...field}
                                                                        className='edit-ad-form__field'
                                                                        data_testId='dt_fixed_rate_type'
                                                                        data-lpignore='true'
                                                                        error={getErrorMessages('rate_type')}
                                                                        label={localize(
                                                                            'Fixed rate (1 {{account_currency}})',
                                                                            {
                                                                                account_currency,
                                                                            }
                                                                        )}
                                                                        label_className='edit-ad-form__label--focused'
                                                                        onChange={onChangeInput}
                                                                        required
                                                                        trailing_icon={getTrailingComponent(true)}
                                                                        type='text'
                                                                    />
                                                                )
                                                            }
                                                        </Field>
                                                    </div>
                                                    <div className='edit-ad-form__container'>
                                                        <Field name='min_transaction'>
                                                            {({ field }: FieldProps) => (
                                                                <Input
                                                                    {...field}
                                                                    className='edit-ad-form__field'
                                                                    data-lpignore='true'
                                                                    data-testid='min_transaction'
                                                                    error={getErrorMessages('min_transaction')}
                                                                    label={localize('Min order')}
                                                                    trailing_icon={getTrailingComponent()}
                                                                    onChange={onChangeInput}
                                                                    required
                                                                    type='text'
                                                                />
                                                            )}
                                                        </Field>
                                                        <Field name='max_transaction'>
                                                            {({ field }: FieldProps) => (
                                                                <Input
                                                                    {...field}
                                                                    data-lpignore='true'
                                                                    data-testid='max_transaction'
                                                                    type='text'
                                                                    error={getErrorMessages('max_transaction')}
                                                                    label={localize('Max order')}
                                                                    className='edit-ad-form__field'
                                                                    trailing_icon={getTrailingComponent()}
                                                                    onChange={onChangeInput}
                                                                    required
                                                                />
                                                            )}
                                                        </Field>
                                                    </div>
                                                    {is_sell_advert && (
                                                        <React.Fragment>
                                                            <Field name='contact_info'>
                                                                {({ field }: FieldProps) => (
                                                                    <Input
                                                                        {...field}
                                                                        data-lpignore='true'
                                                                        data-testid='contact_info'
                                                                        type='textarea'
                                                                        label={
                                                                            <Text color='less-prominent' size='xs'>
                                                                                <Localize i18n_default_text='Your contact details' />
                                                                            </Text>
                                                                        }
                                                                        error={getErrorMessages('contact_info')}
                                                                        className='edit-ad-form__field edit-ad-form__field--textarea'
                                                                        initial_character_count={contact_info.length}
                                                                        required
                                                                        has_character_counter
                                                                        max_characters={300}
                                                                    />
                                                                )}
                                                            </Field>
                                                        </React.Fragment>
                                                    )}
                                                    <Field name='description'>
                                                        {({ field }: FieldProps) => (
                                                            <Input
                                                                {...field}
                                                                className='edit-ad-form__field edit-ad-form__field--textarea'
                                                                data-lpignore='true'
                                                                data-testid='description'
                                                                error={getErrorMessages('description', false)}
                                                                has_character_counter
                                                                hint={localize(
                                                                    'This information will be visible to everyone.'
                                                                )}
                                                                initial_character_count={
                                                                    description ? description.length : 0
                                                                }
                                                                label={
                                                                    <Text color='less-prominent' size='xs'>
                                                                        <Localize i18n_default_text='Instructions (optional)' />
                                                                    </Text>
                                                                }
                                                                max_characters={300}
                                                                type='textarea'
                                                            />
                                                        )}
                                                    </Field>
                                                    <AdPaymentSelectionText is_sell_advert={is_sell_advert} />
                                                    <EditAdFormPaymentMethods
                                                        is_sell_advert={is_sell_advert}
                                                        selected_methods={[...selected_methods]}
                                                        setSelectedMethods={setSelectedMethods}
                                                        touched={setIsPaymentMethodTouched}
                                                    />
                                                </div>
                                                <AdFormSubmit
                                                    ad_option={ads.EDIT}
                                                    handleEditAdFormCancel={handleEditAdFormCancel}
                                                    check_dirty={check_dirty}
                                                    current_method={current_method}
                                                    payment_method_details={payment_method_details}
                                                    payment_method_names={payment_method_names}
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
            )}
        </React.Fragment>
    );
};

export default observer(EditAdForm);
