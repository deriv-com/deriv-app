import * as React from 'react';
import classNames from 'classnames';
import { Formik, Field, Form } from 'formik';
import { Div100vhContainer, Dropdown, Modal, Input, Button, Text, ThemedScrollbars } from '@deriv/components';
import { formatMoney, isDesktop, isMobile, mobileOSDetect } from '@deriv/shared';
import { reaction } from 'mobx';
import { observer } from 'mobx-react-lite';
import { Localize, localize } from 'Components/i18next';
import { useUpdatingAvailableBalance } from 'Components/hooks';
import { buy_sell } from 'Constants/buy-sell';
import { useStores } from 'Stores';
import CreateAdSummary from './create-ad-summary.jsx';

const CreateAdFormWrapper = ({ children }) => {
    if (isMobile()) {
        return <Div100vhContainer height_offset='136px'>{children}</Div100vhContainer>;
    }

    return children;
};

const CreateAdForm = () => {
    const { general_store, my_ads_store } = useStores();
    const { currency, local_currency_config } = general_store.client;
    const available_balance = useUpdatingAvailableBalance();
    const os = mobileOSDetect();
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
                    const is_sell_advert = values.type === buy_sell.SELL;

                    return (
                        <div className='p2p-my-ads__form'>
                            <Form noValidate>
                                <ThemedScrollbars
                                    className={classNames('p2p-my-ads__form-scrollbar', {
                                        'p2p-my-ads__form-scrollbar--ios': is_sell_advert && os === 'iOS',
                                    })}
                                    is_scrollbar_hidden={isMobile()}
                                >
                                    <CreateAdFormWrapper>
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
                                                            !is_sell_advert || available_balance == null
                                                                ? undefined
                                                                : localize('Your DP2P balance is {{ dp2p_balance }}', {
                                                                      dp2p_balance: `${formatMoney(
                                                                          currency,
                                                                          available_balance,
                                                                          true
                                                                      )} ${currency}`,
                                                                  })
                                                        }
                                                        is_relative_hint
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
                                                            <Text
                                                                color={isDesktop() ? 'less-prominent' : 'prominent'}
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
                                            <React.Fragment>
                                                <Field name='payment_info'>
                                                    {({ field }) => (
                                                        <Input
                                                            {...field}
                                                            data-lpignore='true'
                                                            type='textarea'
                                                            label={
                                                                <Text color='less-prominent' size='xs'>
                                                                    <Localize i18n_default_text='Your payment details' />
                                                                </Text>
                                                            }
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
                                                <Field name='contact_info'>
                                                    {({ field }) => (
                                                        <Input
                                                            {...field}
                                                            data-lpignore='true'
                                                            type='textarea'
                                                            label={
                                                                <Text color='less-prominent' size='xs'>
                                                                    <Localize i18n_default_text='Your contact details' />
                                                                </Text>
                                                            }
                                                            error={touched.contact_info && errors.contact_info}
                                                            className='p2p-my-ads__form-field p2p-my-ads__form-field--textarea'
                                                            initial_character_count={my_ads_store.contact_info.length}
                                                            required
                                                            has_character_counter
                                                            max_characters={300}
                                                        />
                                                    )}
                                                </Field>
                                            </React.Fragment>
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
                                                    label={
                                                        <Text color='less-prominent' size='xs'>
                                                            <Localize i18n_default_text='Instructions (optional)' />
                                                        </Text>
                                                    }
                                                    hint={localize('This information will be visible to everyone')}
                                                    className='p2p-my-ads__form-field p2p-my-ads__form-field--textarea'
                                                    initial_character_count={
                                                        my_ads_store.default_advert_description.length
                                                    }
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
                                    </CreateAdFormWrapper>
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
