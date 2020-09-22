import React from 'react';
import { Field, Form, Formik } from 'formik';
import { Button, Icon, Input, Loading, Popover, Table, ThemedScrollbars } from '@deriv/components';
import { requestWS } from 'Utils/websocket';
import { localize } from 'Components/i18next';
import FooterActions from 'Components/footer-actions/footer-actions.jsx';
import { textValidator } from 'Utils/validations';
import Dp2pContext from 'Components/context/dp2p-context';
import { generateHexColourFromNickname, getShortNickname } from 'Utils/string';
import FormError from '../form/error.jsx';
import './my-profile.scss';

const MyProfile = () => {
    const [advertiser_info, setAdvertiserInfo] = React.useState({});
    const [contact_info, setContactInfo] = React.useState('');
    const { currency } = React.useContext(Dp2pContext);
    const [default_advert_description, setDefaultAdvertDescription] = React.useState('');
    const [error_message, setErrorMessage] = React.useState('');
    const [form_error, setFormError] = React.useState('');
    const [has_poa, setHasPoa] = React.useState(false);
    const [has_poi, setHasPoi] = React.useState(false);
    const [is_loading, setIsLoading] = React.useState(true);
    const is_mounted = React.useRef(false);
    const [nickname, setNickname] = React.useState(null);
    const [payment_info, setPaymentInfo] = React.useState('');
    const [stats, setStats] = React.useState({});
    const { daily_buy_limit, daily_sell_limit, id } = advertiser_info;
    const { buy_orders_count, sell_orders_count, total_orders_count } = stats;

    React.useEffect(() => {
        is_mounted.current = true;

        getAdvertiserAccountStatus();
        getAdvertiserStats();
        getAdvertiserInfo();

        return () => (is_mounted.current = false);
    }, []);

    const getAdvertiserAccountStatus = () => {
        return new Promise(resolve => {
            requestWS({
                get_account_status: 1,
            }).then(response => {
                if (is_mounted.current) {
                    if (!response.error) {
                        const { get_account_status } = response;
                        const { authentication } = get_account_status;
                        setHasPoa(authentication.document && authentication.document.status === 'verified');
                        setHasPoi(authentication.identity && authentication.identity.status === 'verified');
                    } else {
                        setErrorMessage(response.error);
                    }
                }
                resolve();
            });
        });
    };

    const getAdvertiserInfo = () => {
        return new Promise(resolve => {
            requestWS({
                p2p_advertiser_info: 1,
            }).then(response => {
                if (is_mounted.current) {
                    if (!response.error) {
                        const { p2p_advertiser_info } = response;
                        setAdvertiserInfo(p2p_advertiser_info);
                        setNickname(p2p_advertiser_info.name);
                        setContactInfo(p2p_advertiser_info.contact_info);
                        setDefaultAdvertDescription(p2p_advertiser_info.default_advert_description);
                        setPaymentInfo(p2p_advertiser_info.payment_info);
                    } else {
                        setErrorMessage(response.error);
                    }
                }
                resolve();
                setIsLoading(false);
            });
        });
    };

    const getAdvertiserStats = () => {
        return new Promise(resolve => {
            requestWS({
                p2p_advertiser_stats: 1,
                id,
            }).then(response => {
                if (is_mounted.current) {
                    if (!response.error) {
                        const { p2p_advertiser_stats } = response;
                        setStats(p2p_advertiser_stats);
                    } else {
                        setErrorMessage(response.error);
                    }
                }
                resolve();
            });
        });
    };

    const handleSubmit = values => {
        setIsLoading(true);
        return new Promise(resolve => {
            requestWS({
                p2p_advertiser_update: 1,
                contact_info: values.contact_info,
                payment_info: values.payment_info,
                default_advert_description: values.default_advert_description,
            }).then(response => {
                if (is_mounted.current) {
                    if (!response.error) {
                        const { p2p_advertiser_update } = response;
                        setContactInfo(p2p_advertiser_update.contact_info);
                        setDefaultAdvertDescription(p2p_advertiser_update.default_advert_description);
                        setPaymentInfo(p2p_advertiser_update.payment_info);
                    } else {
                        setFormError(response.error);
                    }
                    resolve();
                    setIsLoading(false);
                }
            });
        });
    };

    const validateForm = values => {
        const validations = {
            contact_info: [v => textValidator(v)],
            default_advert_description: [v => textValidator(v)],
            payment_info: [v => textValidator(v)],
        };

        const mapped_key = {
            contact_info: localize('Contact details'),
            default_advert_description: localize('Instructions'),
            payment_info: localize('Payment details'),
        };

        const errors = {};

        const getErrorMessages = field_name => [
            localize(
                "{{field_name}} can only include letters, numbers, spaces, and any of these symbols: -+.,'#@():;",
                {
                    field_name,
                }
            ),
        ];

        Object.entries(validations).forEach(([key, rule]) => {
            const error_index = rule.findIndex(v => !v(values[key]));
            if (error_index !== -1) {
                switch (key) {
                    case 'contact_info':
                    case 'default_advert_description':
                    case 'payment_info':
                        errors[key] = getErrorMessages(mapped_key[key])[error_index];
                        break;
                    default: {
                        errors[key] = getErrorMessages[error_index];
                        break;
                    }
                }
            }
        });

        return errors;
    };

    if (is_loading) {
        return <Loading is_fullscreen={false} />;
    }
    if (error_message) {
        return <div className='my-profile__error'>{error_message}</div>;
    }

    return (
        <div className='my-profile'>
            <ThemedScrollbars className='my-profile__scrollbar'>
                <div className='my-profile__header'>
                    <div className='my-profile__header-details'>
                        <div
                            className='my-profile__header-avatar'
                            style={{ backgroundColor: generateHexColourFromNickname(nickname) }}
                        >
                            {getShortNickname(nickname)}
                        </div>
                        <div className='my-profile__header-name'>{nickname}</div>
                    </div>
                    <div className='my-profile__header-verification'>
                        {has_poi && (
                            <div>
                                {localize('ID verified')}
                                <Icon
                                    className='my-profile__header-verification-icon'
                                    icon='IcCashierVerificationBadge'
                                    size={16}
                                />
                            </div>
                        )}
                        {has_poa && (
                            <div className='my-profile__header-verification-status'>
                                {localize('Address verified')}
                                <Icon
                                    className='my-profile__header-verification-icon'
                                    icon='IcCashierVerificationBadge'
                                    size={16}
                                />
                            </div>
                        )}
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
                                    {localize('Buy ({{currency}})', { currency })}
                                </div>
                                <div className='my-profile__stats-cell-info'>{buy_orders_count || '-'}</div>
                            </Table.Cell>
                            <div className='my-profile__stats-cell-separator' />
                            <Table.Cell className='my-profile__stats-cell'>
                                <div className='my-profile__stats-cell-header'>
                                    {localize('Sell ({{currency}})', { currency })}
                                </div>
                                <div className='my-profile__stats-cell-info'>{sell_orders_count || '-'}</div>
                            </Table.Cell>
                            <div className='my-profile__stats-cell-separator' />
                            <Table.Cell className='my-profile__stats-cell'>
                                <div className='my-profile__stats-cell-header'>
                                    {localize('Buy / Sell limit ({{currency}})', { currency })}
                                </div>
                                <div className='my-profile__stats-cell-info'>
                                    {daily_buy_limit && daily_sell_limit
                                        ? `${Math.floor(daily_buy_limit)} / ${Math.floor(daily_sell_limit)}`
                                        : '-'}
                                </div>
                            </Table.Cell>
                            <div className='my-profile__stats-cell-separator' />
                            <Popover
                                classNameBubble='my-profile__popover-text'
                                alignment='top'
                                message={localize(
                                    "These fields are based on the last 24 hours' activity: Buy, Sell, and Limit."
                                )}
                            >
                                <Icon className='my-profile__popover-icon' icon='IcInfoOutline' size={16} />
                            </Popover>
                        </Table.Row>
                    </Table>
                    <div className='my-profile__separator'>
                        <div className='my-profile__separator-text'>{localize('Ad template')}</div>
                        <div className='my-profile__separator-horizontal_line' />
                    </div>
                    <Formik
                        enableReinitialize={true}
                        initialValues={{
                            contact_info,
                            default_advert_description,
                            payment_info,
                        }}
                        onSubmit={handleSubmit}
                        validate={validateForm}
                    >
                        {({ dirty, errors, isSubmitting, isValid, resetForm }) => {
                            return (
                                <Form noValidate>
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
                                                    max_characters={300}
                                                />
                                            )}
                                        </Field>

                                        <FooterActions className='my-profile__footer' has_border>
                                            <FormError message={form_error} />
                                            <Button
                                                className='my-profile__footer-button'
                                                is_disabled={!dirty || isSubmitting}
                                                secondary
                                                large
                                                onClick={resetForm}
                                            >
                                                {localize('Cancel')}
                                            </Button>
                                            <Button
                                                className='my-profile__footer-button'
                                                is_disabled={!dirty || isSubmitting || !isValid}
                                                primary
                                                large
                                            >
                                                {localize('Save')}
                                            </Button>
                                        </FooterActions>
                                    </React.Fragment>
                                </Form>
                            );
                        }}
                    </Formik>
                </React.Fragment>
            </ThemedScrollbars>
        </div>
    );
};

export default MyProfile;
