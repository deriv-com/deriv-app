import * as React from 'react';
import classNames from 'classnames';
import { Formik, Field, Form } from 'formik';
import { Button, Div100vhContainer, Input, Modal, Text, ThemedScrollbars } from '@deriv/components';
import { formatMoney, isDesktop, isMobile, mobileOSDetect } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import { Localize, localize } from 'Components/i18next';
import { useUpdatingAvailableBalance } from 'Components/hooks';
import { buy_sell } from 'Constants/buy-sell';
import { useStores } from 'Stores';
import PageReturn from 'Components/page-return/page-return.jsx';
import EditAdFormPaymentMethods from './edit-ad-form-payment-methods.jsx';
import CreateAdAddPaymentMethodModal from './create-ad-add-payment-method-modal.jsx';
import EditAdSummary from './edit-ad-summary.jsx';

const EditAdFormWrapper = ({ children }) => {
    if (isMobile()) {
        return <Div100vhContainer height_offset='auto'>{children}</Div100vhContainer>;
    }

    return children;
};

const EditAdForm = () => {
    const { my_ads_store, my_profile_store } = useStores();
    const available_balance = useUpdatingAvailableBalance();
    const os = mobileOSDetect();

    const {
        account_currency,
        amount_display,
        contact_info,
        description,
        local_currency,
        max_order_amount_display,
        min_order_amount_display,
        payment_method_names,
        payment_method_details,
        rate_display,
        type,
    } = my_ads_store.p2p_advert_information;

    const is_buy_advert = type === buy_sell.BUY;
    const [selected_methods, setSelectedMethods] = React.useState([]);

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

    React.useEffect(() => {
        my_profile_store.getPaymentMethodsList();
        my_profile_store.getAdvertiserPaymentMethods();
        my_ads_store.setIsEditAdErrorModalVisible(false);
        my_ads_store.setEditAdFormError('');

        if (payment_method_names && !payment_method_details) {
            payment_method_names?.forEach(pm => {
                my_profile_store.getPaymentMethodValue(pm);
                selected_methods.push(my_profile_store.payment_method_value);
                my_ads_store.payment_method_names.push(my_profile_store.payment_method_value);
            });
        }
        if (payment_method_details) {
            Object.entries(payment_method_details)?.map(pm => {
                selected_methods.push(pm[0]);
                my_ads_store.payment_method_ids.push(pm[0]);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <React.Fragment>
            <PageReturn
                onClick={() => my_ads_store.setShowEditAdForm(false)}
                page_title={localize('Edit {{ad_type}} ad', { ad_type: type })}
            />
            <Formik
                initialValues={{
                    contact_info,
                    description,
                    max_transaction: max_order_amount_display,
                    min_transaction: min_order_amount_display,
                    offer_amount: amount_display,
                    price_rate: rate_display,
                    type,
                }}
                onSubmit={my_ads_store.onClickSaveEditAd}
                validate={my_ads_store.validateEditAdForm}
            >
                {({ dirty, errors, handleChange, isSubmitting, isValid, touched, values }) => {
                    const is_sell_advert = values.type === buy_sell.SELL;
                    return (
                        <div className='p2p-my-ads__form'>
                            <Form
                                className={classNames('p2p-my-ads__form-element', {
                                    'p2p-my-ads__form-element--ios': is_sell_advert && os === 'iOS',
                                })}
                                noValidate
                            >
                                <ThemedScrollbars
                                    className='p2p-my-ads__form-scrollbar'
                                    is_scrollbar_hidden={isMobile()}
                                >
                                    <EditAdFormWrapper>
                                        <div className='p2p-my-ads__form-summary'>
                                            <EditAdSummary
                                                offer_amount={errors.offer_amount ? '' : values.offer_amount}
                                                price_rate={errors.price_rate ? '' : values.price_rate}
                                                type={values.type}
                                            />
                                        </div>
                                        <div className='p2p-my-ads__form-container'>
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
                                                                {account_currency}
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
                                                                          account_currency,
                                                                          available_balance,
                                                                          true
                                                                      )} ${account_currency}`,
                                                                  })
                                                        }
                                                        is_relative_hint
                                                        disabled={true}
                                                    />
                                                )}
                                            </Field>
                                            <Field name='price_rate'>
                                                {({ field }) => (
                                                    <Input
                                                        {...field}
                                                        data-lpignore='true'
                                                        type='text'
                                                        error={touched.price_rate && errors.price_rate}
                                                        label={localize('Fixed rate (1 {{account_currency}})', {
                                                            account_currency,
                                                        })}
                                                        className='p2p-my-ads__form-field'
                                                        trailing_icon={
                                                            <Text
                                                                color={isDesktop() ? 'less-prominent' : 'prominent'}
                                                                line_height='m'
                                                                size={isDesktop() ? 'xxs' : 's'}
                                                            >
                                                                {local_currency}
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
                                        <div className='p2p-my-ads__form-container'>
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
                                                                {account_currency}
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
                                                                {account_currency}
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
                                            {({ field }) => (
                                                <Input
                                                    {...field}
                                                    data-lpignore='true'
                                                    type='textarea'
                                                    error={touched.description && errors.description}
                                                    label={
                                                        <Text color='less-prominent' size='xs'>
                                                            <Localize i18n_default_text='Instructions (optional)' />
                                                        </Text>
                                                    }
                                                    hint={localize('This information will be visible to everyone.')}
                                                    className='p2p-my-ads__form-field p2p-my-ads__form-field--textarea'
                                                    initial_character_count={description ? description.length : 0}
                                                    has_character_counter
                                                    max_characters={300}
                                                />
                                            )}
                                        </Field>
                                        <div className='p2p-my-ads__form-payment-methods--text'>
                                            <Text color='prominent'>
                                                <Localize i18n_default_text='Payment methods' />
                                            </Text>
                                            <Text color='less-prominent'>
                                                <Localize i18n_default_text='You may choose up to 3.' />
                                            </Text>
                                        </div>
                                        <EditAdFormPaymentMethods
                                            is_sell_advert={is_sell_advert}
                                            payment_method_names={payment_method_names}
                                            selected_methods={selected_methods}
                                            setSelectedMethods={setSelectedMethods}
                                        />
                                        <div className='p2p-my-ads__form-container p2p-my-ads__form-footer'>
                                            <Button
                                                className='p2p-my-ads__form-button'
                                                secondary
                                                large
                                                onClick={() => my_ads_store.setShowEditAdForm(false)}
                                                type='button'
                                            >
                                                <Localize i18n_default_text='Cancel' />
                                            </Button>
                                            <Button
                                                className='p2p-my-ads__form-button'
                                                has_effect
                                                primary
                                                large
                                                is_disabled={
                                                    isSubmitting ||
                                                    !isValid ||
                                                    (!dirty && !payment_methods_changed) ||
                                                    selected_methods.length === 0 ||
                                                    !(!!payment_method_names || !!payment_method_details)
                                                }
                                            >
                                                <Localize i18n_default_text='Save changes' />
                                            </Button>
                                        </div>
                                    </EditAdFormWrapper>
                                </ThemedScrollbars>
                            </Form>
                        </div>
                    );
                }}
            </Formik>
            <CreateAdAddPaymentMethodModal />
            <Modal
                className='p2p-my-ads__modal-error'
                is_open={my_ads_store.is_edit_ad_error_modal_visible}
                small
                has_close_icon={false}
                title={localize('Something’s not right')}
            >
                <Modal.Body>
                    <Text as='p' size='xs' color='prominent'>
                        {my_ads_store.edit_ad_form_error}
                    </Text>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        has_effect
                        text={localize('Ok')}
                        onClick={() => my_ads_store.setIsEditAdErrorModalVisible(false)}
                        primary
                        large
                    />
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

export default observer(EditAdForm);
