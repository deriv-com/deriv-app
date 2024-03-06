import React from 'react';
import { Field, FormikValues, useFormikContext } from 'formik';
import { Input, RadioGroup, Text } from '@deriv/components';
import { formatMoney } from '@deriv/shared';
import { useStore } from '@deriv/stores';
import FloatingRate from 'Components/floating-rate';
import { localize, Localize } from 'Components/i18next';
import { buy_sell } from 'Constants/buy-sell';
import { ad_type } from 'Constants/floating-rate';
import AdFormController from 'Pages/my-ads/ad-form-controller';
import { useStores } from 'Stores';

type AdTypeSection = {
    action?: string;
};

const AdTypeSection = ({ action = 'add', ...props }: AdTypeSection) => {
    const {
        client: { currency, local_currency_config },
        ui: is_desktop,
    } = useStore();
    const local_currency = local_currency_config.currency;
    const { buy_sell_store, floating_rate_store, general_store, my_ads_store, my_profile_store } = useStores();
    const [selected_methods, setSelectedMethods] = React.useState([]);
    const { dirty, errors, handleChange, isValid, setFieldValue, setFieldTouched, touched, values } =
        useFormikContext<FormikValues>();
    const { payment_method_details, payment_method_names, type } = my_ads_store.p2p_advert_information;
    const is_buy_advert = type === buy_sell.BUY;
    const is_edit = action === 'edit';
    const is_next_btn_disabled = is_edit ? !isValid : !dirty || !isValid;
    const onChangeAdTypeHandler = (user_input: string) => {
        if (floating_rate_store.rate_type === ad_type.FLOAT) {
            if (user_input === buy_sell.SELL) {
                setFieldValue('rate_type', '+0.01');
            } else {
                setFieldValue('rate_type', '-0.01');
            }
        }

        setFieldValue('type', user_input);
    };

    const onCancel = () => {
        if (is_edit) {
            const payment_methods_changed = is_buy_advert
                ? !(
                      !!payment_method_names &&
                      selected_methods?.every(pm => {
                          const method = my_profile_store.getPaymentMethodDisplayName(pm);
                          return payment_method_names.includes(method);
                      }) &&
                      selected_methods.length === payment_method_names.length
                  )
                : !(
                      !!payment_method_details &&
                      selected_methods.every(pm => Object.keys(payment_method_details).includes(pm)) &&
                      selected_methods.length === Object.keys(payment_method_details).length
                  );
            if (dirty || payment_methods_changed) {
                general_store.showModal({
                    key: 'AdCancelModal',
                    props: {
                        message: 'If you choose to cancel, the edited details will be lost.',
                        onConfirm: () => {
                            my_ads_store.setShowEditAdForm(false);
                        },
                        title: 'Cancel your edits?',
                    },
                });
            } else {
                my_ads_store.setShowEditAdForm(false);
            }
        } else {
            general_store.showModal({
                key: 'AdCancelModal',
                props: {
                    message: "If you choose to cancel, the details you've entered will be lost.",
                    onConfirm: () => {
                        my_ads_store.setApiErrorMessage('');
                        floating_rate_store.setApiErrorMessage('');
                        my_ads_store.setShowAdForm(false);
                        buy_sell_store.setCreateSellAdFromNoAds(false);
                    },
                    title: 'Cancel ad creation?',
                },
            });
        }
    };

    return (
        <>
            {!is_edit && (
                <Field name='type'>
                    {({ field }) => (
                        <RadioGroup
                            {...field}
                            className='ad-type-section__radio-group'
                            name='type'
                            onToggle={event => onChangeAdTypeHandler(event.target.value)}
                            selected={values.type}
                            required
                        >
                            <RadioGroup.Item value={buy_sell.BUY} label={localize('Buy {{currency}}', { currency })} />
                            <RadioGroup.Item
                                value={buy_sell.SELL}
                                label={localize('Sell {{currency}}', { currency })}
                            />
                        </RadioGroup>
                    )}
                </Field>
            )}
            <div className='ad-type-section__container'>
                <Field name='offer_amount'>
                    {({ field }) => (
                        <Input
                            {...field}
                            data-testid='offer_amount'
                            data-lpignore='true'
                            type='text'
                            error={touched.offer_amount && errors.offer_amount}
                            label={localize('Total amount')}
                            className='ad-type-section__field'
                            trailing_icon={
                                <Text
                                    color={is_desktop ? 'less-prominent' : 'prominent'}
                                    size={is_desktop ? 'xxs' : 's'}
                                >
                                    {currency}
                                </Text>
                            }
                            onFocus={() => setFieldTouched('offer_amount', true)}
                            onChange={e => {
                                my_ads_store.restrictLength(e, handleChange);
                            }}
                            hint={
                                values.type !== buy_sell.SELL || general_store.advertiser_info.balance_available == null
                                    ? undefined
                                    : localize('Your Deriv P2P balance is {{ dp2p_balance }}', {
                                          dp2p_balance: `${formatMoney(
                                              currency,
                                              general_store.advertiser_info.balance_available,
                                              true
                                          )} ${currency}`,
                                      })
                            }
                            is_relative_hint
                        />
                    )}
                </Field>
                <Field name='rate_type'>
                    {({ field }) =>
                        floating_rate_store.rate_type === ad_type.FLOAT ? (
                            <FloatingRate
                                className='ad-type-section__field'
                                data_testid='float_rate_type'
                                error_messages={errors.rate_type}
                                fiat_currency={currency}
                                local_currency={local_currency}
                                onChange={handleChange}
                                onFocus={() => setFieldTouched('rate_type', true)}
                                offset={{
                                    upper_limit: parseInt(floating_rate_store.float_rate_offset_limit),
                                    lower_limit: parseInt(floating_rate_store.float_rate_offset_limit) * -1,
                                }}
                                required
                                change_handler={e => {
                                    my_ads_store.restrictDecimalPlace(e, handleChange);
                                }}
                                {...field}
                            />
                        ) : (
                            <Input
                                {...field}
                                data-testid='fixed_rate_type'
                                data-lpignore='true'
                                type='text'
                                error={touched.rate_type && errors.rate_type}
                                label={localize('Fixed rate (1 {{currency}})', {
                                    currency,
                                })}
                                className='ad-type-section__field'
                                trailing_icon={
                                    <Text
                                        color={is_desktop ? 'less-prominent' : 'prominent'}
                                        size={is_desktop ? 'xxs' : 's'}
                                    >
                                        {local_currency}
                                    </Text>
                                }
                                onChange={e => {
                                    my_ads_store.restrictLength(e, handleChange);
                                }}
                                onFocus={() => setFieldTouched('rate_type', true)}
                                required
                            />
                        )
                    }
                </Field>
            </div>
            <div className='ad-type-section__container'>
                <Field name='min_transaction'>
                    {({ field }) => (
                        <Input
                            {...field}
                            data-lpignore='true'
                            data-testid='min_transaction'
                            type='text'
                            error={touched.min_transaction && errors.min_transaction}
                            label={localize('Min order')}
                            className='ad-type-section__field'
                            trailing_icon={
                                <Text
                                    color={is_desktop ? 'less-prominent' : 'prominent'}
                                    size={is_desktop ? 'xxs' : 's'}
                                >
                                    {currency}
                                </Text>
                            }
                            onChange={e => {
                                my_ads_store.restrictLength(e, handleChange);
                            }}
                            onFocus={() => setFieldTouched('min_transaction', true)}
                            required
                        />
                    )}
                </Field>
                <Field name='max_transaction'>
                    {({ field }) => (
                        <Input
                            {...field}
                            data-testid='max_transaction'
                            data-lpignore='true'
                            type='text'
                            error={touched.max_transaction && errors.max_transaction}
                            label={localize('Max order')}
                            className='ad-type-section__field'
                            trailing_icon={
                                <Text
                                    color={is_desktop ? 'less-prominent' : 'prominent'}
                                    size={is_desktop ? 'xxs' : 's'}
                                >
                                    {currency}
                                </Text>
                            }
                            onChange={e => {
                                my_ads_store.restrictLength(e, handleChange);
                            }}
                            onFocus={() => setFieldTouched('max_transaction', true)}
                            required
                        />
                    )}
                </Field>
            </div>
            {values.type === buy_sell.SELL && (
                <div className='ad-type-section__field--contact-details'>
                    <Field name='contact_info'>
                        {({ field }) => (
                            <Input
                                {...field}
                                data-testid='contact_info'
                                data-lpignore='true'
                                type='textarea'
                                label={
                                    <Text color='less-prominent' size='xs'>
                                        <Localize i18n_default_text='Your contact details' />
                                    </Text>
                                }
                                error={touched.contact_info && errors.contact_info}
                                className='ad-type-section__field ad-type-section__field--textarea'
                                initial_character_count={general_store.contact_info.length}
                                required
                                has_character_counter
                                max_characters={300}
                                onFocus={() => setFieldTouched('contact_info', true)}
                            />
                        )}
                    </Field>
                </div>
            )}
            <Field name='default_advert_description'>
                {({ field }) => (
                    <Input
                        {...field}
                        data-testid='default_advert_description'
                        data-lpignore='true'
                        type='textarea'
                        error={touched.default_advert_description && errors.default_advert_description}
                        label={
                            <Text color='less-prominent' size='xs'>
                                <Localize i18n_default_text='Instructions (optional)' />
                            </Text>
                        }
                        hint={localize('This information will be visible to everyone.')}
                        className='ad-type-section__field ad-type-section__field--textarea'
                        initial_character_count={general_store.default_advert_description.length}
                        has_character_counter
                        max_characters={300}
                        onFocus={() => setFieldTouched('default_advert_description', true)}
                        required
                    />
                )}
            </Field>
            <AdFormController {...props} is_next_btn_disabled={is_next_btn_disabled} onCancel={onCancel} />
        </>
    );
};

export default AdTypeSection;
