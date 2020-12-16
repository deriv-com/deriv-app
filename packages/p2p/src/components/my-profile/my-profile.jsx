import React from 'react';
import PropTypes from 'prop-types';
import { Field, Form, Formik } from 'formik';
import { Button, Icon, Input, Loading, Popover, Table, Text, ThemedScrollbars, ToggleSwitch } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';
import { localize, Localize } from 'Components/i18next';
import { generateHexColourFromNickname, getShortNickname } from 'Utils/string';
import { useStores } from 'Stores';
import FormError from '../form/error.jsx';
import './my-profile.scss';

const MyProfile = observer(() => {
    const { general_store, my_profile_store } = useStores();
    const { currency } = general_store.client;
    const [has_on_screen_keyboard, setHasOnScreenKeyboard] = React.useState(false);

    const {
        basic_verification,
        daily_buy,
        daily_buy_limit,
        daily_sell,
        daily_sell_limit,
        full_verification,
        total_orders_count,
    } = my_profile_store.advertiser_info;

    React.useEffect(() => {
        my_profile_store.getSettings();
        my_profile_store.getAdvertiserInfo();
    }, []);

    const setCurrentFocus = target => {
        setHasOnScreenKeyboard(isMobile() && target);
    };

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
        <div className='my-profile'>
            <ThemedScrollbars className='my-profile__scrollbar'>
                <div className='my-profile__header'>
                    <div className='my-profile__header-details'>
                        <div
                            className='my-profile__header-avatar'
                            style={{ backgroundColor: generateHexColourFromNickname(general_store.nickname) }}
                        >
                            <Text size='xs' color='colored-background'>
                                {getShortNickname(general_store.nickname)}
                            </Text>
                        </div>
                        <div className='my-profile__header-name'>
                            <Text color='prominent' weight='bold'>
                                {general_store.nickname}
                            </Text>
                        </div>
                    </div>
                    <div className='my-profile__header-verification'>
                        {basic_verification ? (
                            <div>
                                <Text color='less-prominent' size='xs'>
                                    {localize('ID verified')}
                                </Text>
                                <Icon
                                    className='my-profile__header-verification-icon'
                                    icon='IcCashierVerificationBadge'
                                    size={16}
                                />
                            </div>
                        ) : null}
                        {full_verification ? (
                            <div className='my-profile__header-verification-status'>
                                <Text color='less-prominent' size='xs'>
                                    {localize('Address verified')}
                                </Text>
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
                                <Text size={isMobile() ? 'xxxs' : 'xs'} color='less-prominent' line_height='m' as='p'>
                                    {localize('Total orders')}
                                </Text>
                                <Text color='prominent' weight='bold' line_height='l' as='p'>
                                    {total_orders_count || '-'}
                                </Text>
                            </Table.Cell>
                            <div className='my-profile__stats-cell-separator' />
                            {isMobile() ? (
                                <Table.Cell className='my-profile__stats-cell'>
                                    <Text
                                        size={isMobile() ? 'xxxs' : 'xs'}
                                        color='less-prominent'
                                        line_height='m'
                                        as='p'
                                    >
                                        {localize('Buy / Sell ({{currency}})', {
                                            currency,
                                        })}
                                    </Text>
                                    <Text color='prominent' weight='bold' line_height='l' as='p'>
                                        {daily_buy || '-'}/{daily_sell || '-'}
                                    </Text>
                                </Table.Cell>
                            ) : (
                                <>
                                    <Table.Cell className='my-profile__stats-cell'>
                                        <Text
                                            size={isMobile() ? 'xxxs' : 'xs'}
                                            color='less-prominent'
                                            line_height='m'
                                            as='p'
                                        >
                                            {localize('Buy ({{currency}})', {
                                                currency,
                                            })}
                                        </Text>
                                        <Text color='prominent' weight='bold' line_height='l' as='p'>
                                            {daily_buy || '-'}
                                        </Text>
                                    </Table.Cell>
                                    <div className='my-profile__stats-cell-separator' />
                                    <Table.Cell className='my-profile__stats-cell'>
                                        <Text
                                            size={isMobile() ? 'xxxs' : 'xs'}
                                            color='less-prominent'
                                            line_height='m'
                                            as='p'
                                        >
                                            {localize('Sell ({{currency}})', {
                                                currency,
                                            })}
                                        </Text>
                                        <Text color='prominent' weight='bold' line_height='l' as='p'>
                                            {daily_sell || '-'}
                                        </Text>
                                    </Table.Cell>
                                </>
                            )}
                            <div className='my-profile__stats-cell-separator' />
                            <Table.Cell className='my-profile__stats-cell'>
                                <Text size={isMobile() ? 'xxxs' : 'xs'} color='less-prominent' line_height='m' as='p'>
                                    {localize('Buy / Sell limit ({{currency}})', {
                                        currency,
                                    })}
                                </Text>
                                <Text color='prominent' weight='bold' line_height='l' as='p'>
                                    {daily_buy_limit && daily_sell_limit
                                        ? `${Math.floor(daily_buy_limit)} / ${Math.floor(daily_sell_limit)}`
                                        : '-'}
                                </Text>
                            </Table.Cell>
                            {!isMobile() && <div className='my-profile__stats-cell-separator' />}
                            <Table.Cell>
                                <Popover
                                    classNameBubble='my-profile__popover-text'
                                    alignment='top'
                                    message={localize(
                                        "These fields are based on the last 24 hours' activity: Buy, Sell, and Limit."
                                    )}
                                    zIndex={2}
                                >
                                    <Icon className='my-profile__popover-icon' icon='IcInfoOutline' size={16} />
                                </Popover>
                            </Table.Cell>
                        </Table.Row>
                    </Table>
                    <div className='my-profile__separator'>
                        <div className='my-profile__separator-text--privacy'>
                            <Text size='xs' color='prominent' weight='bold'>
                                {localize('Privacy setting')}
                            </Text>
                        </div>
                        <div className='my-profile__separator-horizontal_line' />
                    </div>
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
                    <div className='my-profile__separator'>
                        <div className='my-profile__separator-text'>
                            <Text size='xs' color='prominent' weight='bold'>
                                {localize('Ad template')}
                            </Text>
                        </div>
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
                                <Form
                                    className={classNames('my-profile__form', {
                                        'my-profile__form--active-keyboard': has_on_screen_keyboard,
                                    })}
                                >
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
                                                    onFocus={e => setCurrentFocus(e.currentTarget.name)}
                                                    onBlur={() => setCurrentFocus(null)}
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
                                                    onFocus={e => setCurrentFocus(e.currentTarget.name)}
                                                    onBlur={() => setCurrentFocus(null)}
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
                                                    onFocus={e => setCurrentFocus(e.currentTarget.name)}
                                                    onBlur={() => setCurrentFocus(null)}
                                                />
                                            )}
                                        </Field>
                                        <div
                                            className={classNames('my-profile__footer', {
                                                'my-profile__footer--active-keyboard': has_on_screen_keyboard,
                                            })}
                                        >
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

export default MyProfile;
