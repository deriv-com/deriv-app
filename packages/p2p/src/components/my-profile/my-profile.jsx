import React from 'react';
import PropTypes from 'prop-types';
import { Field, Form, Formik } from 'formik';
import {
    Button,
    Div100vhContainer,
    Icon,
    Input,
    LineSeparatedComponents,
    Loading,
    Money,
    PopoverMobile,
    Table,
    ThemedScrollbars,
    Text,
    ToggleSwitch,
} from '@deriv/components';
import { isDesktop, isMobile } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';
import { localize, Localize } from 'Components/i18next';
import FormError from 'Components/form/error.jsx';
import UserAvatar from 'Components/user/user-avatar/user-avatar.jsx';
import { useStores } from 'Stores';
import './my-profile.scss';

const ContentWrapper = ({ children, className }) => {
    if (isMobile()) {
        // (core header + tab header + tabs) = 120px + (floating footer) = 74px
        const content_height = 120 + 74;

        return (
            <Div100vhContainer className={className} height_offset={`${content_height}px`}>
                {children}
            </Div100vhContainer>
        );
    }

    return <ThemedScrollbars className={className}>{children}</ThemedScrollbars>;
};

const MyProfile = () => {
    const { general_store, my_profile_store } = useStores();
    const { currency } = general_store.client;
    const {
        balance_available,
        daily_buy,
        daily_buy_limit,
        daily_sell,
        daily_sell_limit,
        total_orders_count,
    } = my_profile_store.advertiser_info;

    const [is_balance_tooltip_open, setIsBalanceTooltipOpen] = React.useState(false);
    const [is_statistics_tooltip_open, setIsStatisticsTooltipOpen] = React.useState(false);

    React.useEffect(() => {
        my_profile_store.getSettings();
        my_profile_store.getAdvertiserInfo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (my_profile_store.is_loading) {
        return <Loading is_fullscreen={false} />;
    }

    if (my_profile_store.error_message) {
        return (
            <div className='my-profile__error'>
                <Text size='xs' font='loss-danger'>
                    {my_profile_store.error_message}
                </Text>
            </div>
        );
    }

    return (
        <ContentWrapper className='my-profile'>
            <div className='my-profile__header'>
                <div className='my-profile__header-details'>
                    <UserAvatar
                        className='my-profile__header-avatar'
                        nickname={general_store.nickname}
                        size={32}
                        text_size={isMobile() ? 's' : 'xs'}
                    />
                    <div className='my-profile__header-name'>
                        <Text color='prominent' weight='bold' size='s' line_height='m'>
                            {general_store.nickname}
                        </Text>
                    </div>
                </div>
            </div>
            <LineSeparatedComponents className='my-profile__balance-wrapper' is_invisible_line={isMobile()}>
                <Text size='xs' line_height='m' color='less-prominent'>
                    <Localize i18n_default_text='Available DP2P balance' />
                </Text>
                <div className='my-profile__balance'>
                    <Text
                        className='my-profile__balance-amount'
                        color='prominent'
                        line_height='m'
                        size={isMobile() ? 'xs' : 's'}
                        weight='bold'
                    >
                        <Money amount={balance_available} currency={currency} show_currency />
                    </Text>
                    <PopoverMobile
                        button_text={localize('Got it')}
                        is_open={is_balance_tooltip_open}
                        message={localize(
                            'DP2P balance = deposits that can’t be reversed (bank transfers, etc.) + a portion of deposits that might be reversed (credit card payments, etc.)'
                        )}
                        setIsOpen={setIsBalanceTooltipOpen}
                        title={localize('Available balance')}
                    >
                        <Icon icon='IcInfoOutline' size={16} />
                    </PopoverMobile>
                </div>
            </LineSeparatedComponents>
            <Table>
                <Table.Row className='my-profile__stats'>
                    <div className='my-profile__stats-cell-separator' />
                    <Table.Cell className='my-profile__stats-cell'>
                        <Text size={isMobile() ? 'xxxs' : 'xs'} color='less-prominent' line_height='m' as='p'>
                            <Localize i18n_default_text='Total orders' />
                        </Text>
                        <Text color='prominent' weight='bold' line_height='m' as='p' size={isMobile() ? 'xs' : 's'}>
                            {total_orders_count || '-'}
                        </Text>
                    </Table.Cell>
                    <div className='my-profile__stats-cell-separator' />
                    {isMobile() ? (
                        <Table.Cell className='my-profile__stats-cell'>
                            <Text size={isMobile() ? 'xxxs' : 'xs'} color='less-prominent' line_height='m' as='p'>
                                {localize('Buy / Sell ({{currency}})', {
                                    currency: general_store.client.currency,
                                })}
                            </Text>
                            <Text color='prominent' weight='bold' line_height='l' as='p'>
                                {daily_buy || '-'}/{daily_sell || '-'}
                            </Text>
                        </Table.Cell>
                    ) : (
                        <React.Fragment>
                            <Table.Cell className='my-profile__stats-cell'>
                                <Text size={isMobile() ? 'xxxs' : 'xs'} color='less-prominent' line_height='m' as='p'>
                                    {localize('Buy ({{currency}})', {
                                        currency: general_store.client.currency,
                                    })}
                                </Text>
                                <Text color='prominent' weight='bold' line_height='l' as='p'>
                                    {daily_buy || '0'}
                                </Text>
                            </Table.Cell>
                            <div className='my-profile__stats-cell-separator' />
                            <Table.Cell className='my-profile__stats-cell'>
                                <Text size={isMobile() ? 'xxxs' : 'xs'} color='less-prominent' line_height='m' as='p'>
                                    {localize('Sell ({{currency}})', {
                                        currency: general_store.client.currency,
                                    })}
                                </Text>
                                <Text color='prominent' weight='bold' line_height='l' as='p'>
                                    {daily_sell || '-'}
                                </Text>
                            </Table.Cell>
                        </React.Fragment>
                    )}
                    <div className='my-profile__stats-cell-separator' />
                    <Table.Cell className='my-profile__stats-cell'>
                        <Text size={isMobile() ? 'xxxs' : 'xs'} color='less-prominent' line_height='m' as='p'>
                            <Localize
                                i18n_default_text='Buy / Sell limit ({{currency}})'
                                values={{ currency: general_store.client.currency }}
                            />
                        </Text>
                        <Text color='prominent' weight='bold' line_height='m' as='p' size={isMobile() ? 'xs' : 's'}>
                            {daily_buy_limit && daily_sell_limit
                                ? `${Math.floor(daily_buy_limit)} / ${Math.floor(daily_sell_limit)}`
                                : '-'}
                        </Text>
                    </Table.Cell>
                    {isDesktop() && <div className='my-profile__stats-cell-separator' />}
                    <Table.Cell>
                        <PopoverMobile
                            className='my-profile__stats-popover'
                            button_text={localize('Got it')}
                            is_open={is_statistics_tooltip_open}
                            message={localize(
                                'These fields are based on activities since 00:00 GMT: Buy, Sell, and Buy/Sell limit.'
                            )}
                            setIsOpen={setIsStatisticsTooltipOpen}
                        >
                            <Icon icon='IcInfoOutline' size={16} />
                        </PopoverMobile>
                    </Table.Cell>
                </Table.Row>
            </Table>
            <LineSeparatedComponents className='my-profile__privacy-setting-wrapper'>
                <div className='my-profile__separator-text--privacy'>
                    <Text size='xs' color='prominent' weight='bold'>
                        <Localize i18n_default_text={localize('Privacy setting')} />
                    </Text>
                </div>
            </LineSeparatedComponents>
            <div className='my-profile__toggle-container'>
                <ToggleSwitch
                    id='p2p-toggle-name'
                    classNameLabel='p2p-toggle-name__switch'
                    is_enabled={general_store.should_show_real_name}
                    handleToggle={my_profile_store.handleToggle}
                />
                <Text size='xs' line_height='m' color='prominent' className='my-profile__toggle-name'>
                    <Localize
                        i18n_default_text={'Show my real name ({{full_name}})'}
                        values={{ full_name: my_profile_store.full_name }}
                    />
                </Text>
            </div>
            <LineSeparatedComponents className='my-profile__ad-template-wrapper'>
                <Text size='xs' color='prominent' weight='bold'>
                    <Localize i18n_default_text='Ad template' />
                </Text>
            </LineSeparatedComponents>
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
                        <Form className='my-profile__form'>
                            <React.Fragment>
                                <Field name='payment_info'>
                                    {({ field }) => (
                                        <Input
                                            {...field}
                                            type='textarea'
                                            label={localize('Payment details')}
                                            error={errors.payment_info}
                                            hint={localize('e.g. your bank/e-wallet account details')}
                                            is_relative_hint
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
                                            is_relative_hint
                                            className='my-profile__form-textarea'
                                            has_character_counter
                                            initial_character_count={my_profile_store.default_advert_description.length}
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
        </ContentWrapper>
    );
};

MyProfile.propTypes = {
    advertiser_info: PropTypes.object,
    contact_info: PropTypes.string,
    default_advert_description: PropTypes.string,
    error_message: PropTypes.string,
    form_error: PropTypes.string,
    getAdvertiserInfo: PropTypes.func,
    handleSubmit: PropTypes.func,
    is_button_loading: PropTypes.bool,
    is_loading: PropTypes.bool,
    is_submit_success: PropTypes.bool,
    payment_info: PropTypes.string,
    validateForm: PropTypes.func,
};

export default observer(MyProfile);
