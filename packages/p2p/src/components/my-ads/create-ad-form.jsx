import * as React from 'react';
import { Formik, Field, Form } from 'formik';
import {
    Button,
    Checkbox,
    Div100vhContainer,
    Input,
    Modal,
    RadioGroup,
    Text,
    ThemedScrollbars,
} from '@deriv/components';
import { formatMoney, isDesktop, isMobile } from '@deriv/shared';
import { reaction } from 'mobx';
import { observer } from 'mobx-react-lite';
import FloatingRate from 'Components/floating-rate';
import { Localize, localize } from 'Components/i18next';
import { buy_sell } from 'Constants/buy-sell';
import { ad_type } from 'Constants/floating-rate';
import { useStores } from 'Stores';
import CreateAdSummary from './create-ad-summary.jsx';
import CreateAdFormPaymentMethods from './create-ad-form-payment-methods.jsx';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { api_error_codes } from '../../constants/api-error-codes.js';

const CreateAdFormWrapper = ({ children }) => {
    if (isMobile()) {
        return <Div100vhContainer height_offset='auto'>{children}</Div100vhContainer>;
    }
    return children;
};

const CreateAdForm = () => {
    const { buy_sell_store, floating_rate_store, general_store, my_ads_store, my_profile_store } = useStores();

    const { currency, local_currency_config } = general_store.client;
    const should_not_show_auto_archive_message_again = React.useRef(false);
    const [selected_methods, setSelectedMethods] = React.useState([]);
    const { useRegisterModalProps } = useModalManagerContext();

    // eslint-disable-next-line no-shadow
    const handleSelectPaymentMethods = selected_methods => {
        setSelectedMethods(selected_methods);
    };

    const onCheckboxChange = () =>
        (should_not_show_auto_archive_message_again.current = !should_not_show_auto_archive_message_again.current);

    const onClickOkCreatedAd = () => {
        localStorage.setItem(
            'should_not_show_auto_archive_message',
            JSON.stringify(should_not_show_auto_archive_message_again.current)
        );
        my_ads_store.setIsAdCreatedModalVisible(false);
        if (my_ads_store.advert_details?.visibility_status?.includes(api_error_codes.AD_EXCEEDS_BALANCE)) {
            general_store.showModal({
                key: 'AdVisibilityErrorModal',
                props: { error_code: api_error_codes.AD_EXCEEDS_BALANCE },
            });
        } else if (my_ads_store.advert_details?.visibility_status?.includes(api_error_codes.AD_EXCEEDS_DAILY_LIMIT)) {
            general_store.showModal({
                key: 'AdVisibilityErrorModal',
                props: { error_code: api_error_codes.AD_EXCEEDS_DAILY_LIMIT },
            });
        }

        my_ads_store.setShowAdForm(false);
    };

    // when adding payment methods in creating an ad, once user declines to save their payment method, flow is to close all add payment method modals
    useRegisterModalProps({
        key: 'CancelAddPaymentMethodModal',
        props: {
            should_hide_all_modals_on_cancel: true,
        },
    });

    React.useEffect(() => {
        my_ads_store.setCurrentMethod({ key: null, is_deleted: false });
        my_profile_store.getPaymentMethodsList();
        my_profile_store.getAdvertiserPaymentMethods();
        const disposeApiErrorReaction = reaction(
            () => my_ads_store.api_error_message,
            () => {
                if (my_ads_store.api_error_message) general_store.showModal({ key: 'CreateAdErrorModal', props: {} });
            }
        );
        // P2P configuration is not subscribable. Hence need to fetch it on demand
        general_store.setP2PConfig();

        return () => {
            disposeApiErrorReaction();
            my_ads_store.setApiErrorMessage('');
            floating_rate_store.setApiErrorMessage('');
            my_ads_store.setShowAdForm(false);
            buy_sell_store.setCreateSellAdFromNoAds(false);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        const ad_website_status = setInterval(() => {
            if (my_ads_store.is_ad_created_modal_visible) {
                my_ads_store.getWebsiteStatus();
            }
        }, 10000);

        return () => {
            clearInterval(ad_website_status);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [my_ads_store.is_ad_created_modal_visible]);

    return (
        <React.Fragment>
            <Formik
                initialValues={{
                    contact_info: general_store.contact_info,
                    default_advert_description: general_store.default_advert_description,
                    max_transaction: '',
                    min_transaction: '',
                    offer_amount: '',
                    payment_info: my_ads_store.payment_info,
                    rate_type: floating_rate_store.rate_type === ad_type.FLOAT ? '-0.01' : '',
                    type: buy_sell_store.create_sell_ad_from_no_ads ? buy_sell.SELL : buy_sell.BUY,
                }}
                onSubmit={my_ads_store.handleSubmit}
                validate={my_ads_store.validateCreateAdForm}
                initialErrors={{
                    // Pass one error to ensure Post ad button is disabled initially.
                    offer_amount: true,
                }}
            >
                {({ errors, handleChange, isSubmitting, isValid, setFieldValue, touched, values }) => {
                    const is_sell_advert = values.type === buy_sell.SELL;

                    const onChangeAdTypeHandler = user_input => {
                        if (floating_rate_store.rate_type === ad_type.FLOAT) {
                            if (user_input === buy_sell.SELL) {
                                setFieldValue('rate_type', '+0.01');
                            } else {
                                setFieldValue('rate_type', '-0.01');
                            }
                        }

                        setFieldValue('type', user_input);
                    };

                    return (
                        <div className='p2p-my-ads__form' data-testid='dp2p-create-ad-form_container'>
                            <Form noValidate>
                                <ThemedScrollbars
                                    className='p2p-my-ads__form-scrollbar'
                                    is_scrollbar_hidden={isMobile()}
                                >
                                    <CreateAdFormWrapper>
                                        <div className='p2p-my-ads__form-scrollbar-container'>
                                            <Field name='type'>
                                                {({ field }) => (
                                                    <RadioGroup
                                                        {...field}
                                                        className='p2p-my-ads__form-radio-group'
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
                                            <div className='p2p-my-ads__form-summary'>
                                                <CreateAdSummary
                                                    market_feed={
                                                        floating_rate_store.rate_type === ad_type.FLOAT
                                                            ? floating_rate_store.exchange_rate
                                                            : null
                                                    }
                                                    offer_amount={errors.offer_amount ? '' : values.offer_amount}
                                                    price_rate={values.rate_type}
                                                    type={values.type}
                                                />
                                            </div>
                                            <div className='p2p-my-ads__form-container'>
                                                <Field name='offer_amount'>
                                                    {({ field }) => (
                                                        <Input
                                                            {...field}
                                                            data-testid='offer_amount'
                                                            data-lpignore='true'
                                                            type='text'
                                                            error={touched.offer_amount && errors.offer_amount}
                                                            label={localize('Total amount')}
                                                            className='p2p-my-ads__form-field'
                                                            trailing_icon={
                                                                <Text
                                                                    color={isDesktop() ? 'less-prominent' : 'prominent'}
                                                                    line_height='m'
                                                                    size={isDesktop() ? 'xxs' : 's'}
                                                                >
                                                                    {currency}
                                                                </Text>
                                                            }
                                                            onChange={e => {
                                                                my_ads_store.restrictLength(e, handleChange);
                                                            }}
                                                            hint={
                                                                // Using two "==" is intentional as we're checking for nullish
                                                                // rather than falsy values.
                                                                !is_sell_advert ||
                                                                general_store.advertiser_info.balance_available == null
                                                                    ? undefined
                                                                    : localize(
                                                                          'Your Deriv P2P balance is {{ dp2p_balance }}',
                                                                          {
                                                                              dp2p_balance: `${formatMoney(
                                                                                  currency,
                                                                                  general_store.advertiser_info
                                                                                      .balance_available,
                                                                                  true
                                                                              )} ${currency}`,
                                                                          }
                                                                      )
                                                            }
                                                            is_relative_hint
                                                            required
                                                        />
                                                    )}
                                                </Field>
                                                <Field name='rate_type'>
                                                    {({ field }) =>
                                                        floating_rate_store.rate_type === ad_type.FLOAT ? (
                                                            <FloatingRate
                                                                className='p2p-my-ads__form-field'
                                                                data_testid='float_rate_type'
                                                                error_messages={errors.rate_type}
                                                                fiat_currency={currency}
                                                                local_currency={local_currency_config.currency}
                                                                onChange={handleChange}
                                                                offset={{
                                                                    upper_limit: parseInt(
                                                                        floating_rate_store.float_rate_offset_limit
                                                                    ),
                                                                    lower_limit:
                                                                        parseInt(
                                                                            floating_rate_store.float_rate_offset_limit
                                                                        ) * -1,
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
                                                                className='p2p-my-ads__form-field'
                                                                trailing_icon={
                                                                    <Text
                                                                        color={
                                                                            isDesktop() ? 'less-prominent' : 'prominent'
                                                                        }
                                                                        line_height='m'
                                                                        size={isDesktop() ? 'xxs' : 's'}
                                                                    >
                                                                        {local_currency_config.currency}
                                                                    </Text>
                                                                }
                                                                onChange={e => {
                                                                    my_ads_store.restrictLength(e, handleChange);
                                                                }}
                                                                required
                                                            />
                                                        )
                                                    }
                                                </Field>
                                            </div>
                                            <div className='p2p-my-ads__form-container'>
                                                <Field name='min_transaction'>
                                                    {({ field }) => (
                                                        <Input
                                                            {...field}
                                                            data-lpignore='true'
                                                            data-testid='min_transaction'
                                                            type='text'
                                                            error={touched.min_transaction && errors.min_transaction}
                                                            label={localize('Min order')}
                                                            className='p2p-my-ads__form-field'
                                                            trailing_icon={
                                                                <Text
                                                                    color={isDesktop() ? 'less-prominent' : 'prominent'}
                                                                    line_height='m'
                                                                    size={isDesktop() ? 'xxs' : 's'}
                                                                >
                                                                    {currency}
                                                                </Text>
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
                                                            data-testid='max_transaction'
                                                            data-lpignore='true'
                                                            type='text'
                                                            error={touched.max_transaction && errors.max_transaction}
                                                            label={localize('Max order')}
                                                            className='p2p-my-ads__form-field'
                                                            trailing_icon={
                                                                <Text
                                                                    color={isDesktop() ? 'less-prominent' : 'prominent'}
                                                                    line_height='m'
                                                                    size={isDesktop() ? 'xxs' : 's'}
                                                                >
                                                                    {currency}
                                                                </Text>
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
                                                            className='p2p-my-ads__form-field p2p-my-ads__form-field--textarea'
                                                            initial_character_count={general_store.contact_info.length}
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
                                                        data-testid='default_advert_description'
                                                        data-lpignore='true'
                                                        type='textarea'
                                                        error={
                                                            touched.default_advert_description &&
                                                            errors.default_advert_description
                                                        }
                                                        label={
                                                            <Text color='less-prominent' size='xs'>
                                                                <Localize i18n_default_text='Instructions (optional)' />
                                                            </Text>
                                                        }
                                                        hint={localize('This information will be visible to everyone.')}
                                                        className='p2p-my-ads__form-field p2p-my-ads__form-field--textarea'
                                                        initial_character_count={
                                                            general_store.default_advert_description.length
                                                        }
                                                        has_character_counter
                                                        max_characters={300}
                                                        required
                                                    />
                                                )}
                                            </Field>
                                            <div className='p2p-my-ads__form-payment-methods--text'>
                                                <Text color='prominent'>
                                                    <Localize i18n_default_text='Payment methods' />
                                                </Text>
                                                <Text color='less-prominent'>
                                                    {is_sell_advert ? (
                                                        <Localize i18n_default_text='You may tap and choose up to 3.' />
                                                    ) : (
                                                        <Localize i18n_default_text='You may choose up to 3.' />
                                                    )}
                                                </Text>
                                            </div>
                                            <CreateAdFormPaymentMethods
                                                onSelectPaymentMethods={handleSelectPaymentMethods}
                                                is_sell_advert={is_sell_advert}
                                            />
                                        </div>
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
                                                is_disabled={
                                                    isSubmitting ||
                                                    !isValid ||
                                                    !selected_methods.length ||
                                                    my_ads_store.current_method.is_deleted
                                                }
                                            >
                                                <Localize i18n_default_text='Post ad' />
                                            </Button>
                                        </div>
                                    </CreateAdFormWrapper>
                                </ThemedScrollbars>
                            </Form>
                        </div>
                    );
                }}
            </Formik>
            <Modal
                className='p2p-my-ads__ad-created'
                has_close_icon={false}
                is_open={my_ads_store.is_ad_created_modal_visible}
                small
                title={localize("You've created an ad")}
            >
                <Modal.Body>
                    <Text as='p' size='xs' color='prominent'>
                        <Localize
                            i18n_default_text="If the ad doesn't receive an order for {{adverts_archive_period}} days, it will be deactivated."
                            values={{ adverts_archive_period: my_ads_store.adverts_archive_period }}
                        />
                    </Text>
                    <br />
                    <Checkbox
                        label={localize('Don’t show this message again.')}
                        onChange={onCheckboxChange}
                        value={should_not_show_auto_archive_message_again.current}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button has_effect text={localize('Ok')} onClick={onClickOkCreatedAd} primary large />
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

export default observer(CreateAdForm);
