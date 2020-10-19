import React from 'react';
import { Field, Form, Formik } from 'formik';
import { Button, Icon, Input, Loading, Popover, Table, ThemedScrollbars } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';
import { localize } from 'Components/i18next';
import { generateHexColourFromNickname, getShortNickname } from 'Utils/string';
import { useStores } from 'Stores';
import FormError from '../form/error.jsx';
import './my-profile.scss';

const MyProfile = observer(() => {
    const { general_store, my_profile_store } = useStores();

    const {
        basic_verification,
        buy_orders_count,
        daily_buy_limit,
        daily_sell_limit,
        full_verification,
        sell_orders_count,
        total_orders_count,
    } = my_profile_store.advertiser_info;

    React.useEffect(() => {
        my_profile_store.getAdvertiserInfo();
    }, []);

    if (my_profile_store.is_loading) {
        return <Loading is_fullscreen={false} />;
    }
    if (my_profile_store.error_message) {
        return <div className='my-profile__error'>{my_profile_store.error_message}</div>;
    }

    return (
        <div className='my-profile'>
            <ThemedScrollbars className='my-profile__scrollbar'>
                <div className='my-profile__header'>
                    <div className='my-profile__header-details'>
                        <div
                            className='my-profile__header-avatar'
                            style={{ backgroundColor: generateHexColourFromNickname(general_store.nickname) }}
                        >
                            {getShortNickname(general_store.nickname)}
                        </div>
                        <div className='my-profile__header-name'>{general_store.nickname}</div>
                    </div>
                    <div className='my-profile__header-verification'>
                        {basic_verification ? (
                            <div>
                                {localize('ID verified')}
                                <Icon
                                    className='my-profile__header-verification-icon'
                                    icon='IcCashierVerificationBadge'
                                    size={16}
                                />
                            </div>
                        ) : null}
                        {full_verification ? (
                            <div className='my-profile__header-verification-status'>
                                {localize('Address verified')}
                                <Icon
                                    className='my-profile__header-verification-icon'
                                    icon='IcCashierVerificationBadge'
                                    size={16}
                                />
                            </div>
                        ) : null}
                    </div>
                </div>

                <React.Fragment>
                    <Table>
                        <Table.Row className='my-profile__stats'>
                            <div className='my-profile__stats-cell-separator' />
                            <Table.Cell className='my-profile__stats-cell'>
                                <div className='my-profile__stats-cell-header'>{localize('Total orders')}</div>
                                <div className='my-profile__stats-cell-info'>{total_orders_count || '-'}</div>
                            </Table.Cell>
                            <div className='my-profile__stats-cell-separator' />
                            <Table.Cell className='my-profile__stats-cell'>
                                <div className='my-profile__stats-cell-header'>
                                    {localize('Buy ({{currency}})', { currency: general_store.client.currency })}
                                </div>
                                <div className='my-profile__stats-cell-info'>{buy_orders_count || '-'}</div>
                            </Table.Cell>
                            <div className='my-profile__stats-cell-separator' />
                            <Table.Cell className='my-profile__stats-cell'>
                                <div className='my-profile__stats-cell-header'>
                                    {localize('Sell ({{currency}})', { currency: general_store.client.currency })}
                                </div>
                                <div className='my-profile__stats-cell-info'>{sell_orders_count || '-'}</div>
                            </Table.Cell>
                            <div className='my-profile__stats-cell-separator' />
                            <Table.Cell className='my-profile__stats-cell'>
                                <div className='my-profile__stats-cell-header'>
                                    {localize('Buy / Sell limit ({{currency}})', {
                                        currency: general_store.client.currency,
                                    })}
                                </div>
                                <div className='my-profile__stats-cell-info'>
                                    {daily_buy_limit && daily_sell_limit
                                        ? `${Math.floor(daily_buy_limit)} / ${Math.floor(daily_sell_limit)}`
                                        : '-'}
                                </div>
                            </Table.Cell>
                            <div className='my-profile__stats-cell-separator' />
                            <Table.Cell>
                                <Popover
                                    classNameBubble='my-profile__popover-text'
                                    alignment='top'
                                    message={localize(
                                        "These fields are based on the last 24 hours' activity: Buy, Sell, and Limit."
                                    )}
                                >
                                    <Icon className='my-profile__popover-icon' icon='IcInfoOutline' size={16} />
                                </Popover>
                            </Table.Cell>
                        </Table.Row>
                    </Table>
                    <div className='my-profile__separator'>
                        <div className='my-profile__separator-text'>{localize('Ad template')}</div>
                        <div className='my-profile__separator-horizontal_line' />
                    </div>
                    <Formik
                        enableReinitialize
                        initialValues={{
                            contact_info: my_profile_store.contact_info,
                            default_advert_description: my_profile_store.default_advert_description,
                            payment_info: my_profile_store.payment_info,
                        }}
                        onSubmit={my_profile_store.handleSubmit}
                        validate={my_profile_store.validateForm}
                    >
                        {({ dirty, errors, isSubmitting, isValid }) => {
                            return (
                                <Form>
                                    <React.Fragment>
                                        <Field name='payment_info'>
                                            {({ field }) => (
                                                <Input
                                                    {...field}
                                                    type='textarea'
                                                    label={localize('Payment details')}
                                                    error={errors.payment_info}
                                                    hint={localize('e.g. your bank/e-wallet account details')}
                                                    className='my-profile__form-textarea'
                                                    has_character_counter
                                                    initial_character_count={my_profile_store.payment_info.length}
                                                    max_characters={300}
                                                />
                                            )}
                                        </Field>
                                        <Field name='contact_info'>
                                            {({ field }) => (
                                                <Input
                                                    {...field}
                                                    type='textarea'
                                                    label={localize('Contact details')}
                                                    error={errors.contact_info}
                                                    className='my-profile__form-textarea'
                                                    has_character_counter
                                                    initial_character_count={my_profile_store.contact_info.length}
                                                    max_characters={300}
                                                />
                                            )}
                                        </Field>
                                        <Field name='default_advert_description'>
                                            {({ field }) => (
                                                <Input
                                                    {...field}
                                                    type='textarea'
                                                    label={localize('Instructions')}
                                                    error={errors.default_advert_description}
                                                    hint={localize('This information will be visible to everyone.')}
                                                    className='my-profile__form-textarea'
                                                    has_character_counter
                                                    initial_character_count={
                                                        my_profile_store.default_advert_description.length
                                                    }
                                                    max_characters={300}
                                                />
                                            )}
                                        </Field>
                                        <div className='my-profile__footer'>
                                            <FormError message={my_profile_store.form_error} />

                                            <Button
                                                className={classNames('my-profile__footer-button', {
                                                    'dc-btn--green': my_profile_store.is_submit_success,
                                                })}
                                                is_disabled={!dirty || isSubmitting || !isValid}
                                                is_loading={my_profile_store.is_button_loading}
                                                is_submit_success={my_profile_store.is_submit_success}
                                                text={localize('Save')}
                                                has_effect
                                                primary
                                                large
                                            />
                                        </div>
                                    </React.Fragment>
                                </Form>
                            );
                        }}
                    </Formik>
                </React.Fragment>
            </ThemedScrollbars>
        </div>
    );
});

export default MyProfile;
