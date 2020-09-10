import React from 'react';
import { Field, Form, Formik } from 'formik';
import { Button, Icon, Input, Loading, Table } from '@deriv/components';
import { requestWS } from 'Utils/websocket';
import { Localize, localize } from 'Components/i18next';
import FooterActions from 'Components/footer-actions/footer-actions.jsx';
import Empty from 'Components/empty/empty.jsx';
import Dp2pContext from 'Components/context/dp2p-context';
import { textValidator } from 'Utils/validations';
import { generateHexColourFromNickname, getShortNickname } from 'Utils/string';
import './my-profile.scss';

const MyProfile = () => {
    const { changeTab } = React.useContext(Dp2pContext);
    const [advertiser_info, setAdvertiserInfo] = React.useState({});

    const [has_poa, setHasPoa] = React.useState(false);
    const [has_poi, setHasPoi] = React.useState(false);
    const [is_loading, setIsLoading] = React.useState(true);
    const [is_mounted, setIsMounted] = React.useState(false);
    const [nickname, setNickname] = React.useState(null);
    const [stats, setStats] = React.useState({});
    const { buy_orders_count, sell_orders_count, total_orders_count } = stats;
    const {
        contact_info,
        // daily_buy_limit,
        // daily_sell_limit,
        default_advert_description,
        id,
        payment_info,
    } = advertiser_info;

    React.useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    React.useEffect(() => {
        if (is_mounted) {
            advertiserAccountStatus();
            advertiserStats();
            advertiserInfo();
        }
    }, [is_mounted]);

    const advertiserAccountStatus = () => {
        return new Promise(resolve => {
            requestWS({
                get_account_status: 1,
            }).then(response => {
                if (!response.error) {
                    const { get_account_status } = response;
                    const { authentication } = get_account_status;
                    setHasPoa(!(authentication.document && authentication.document.status === 'none'));
                    setHasPoi(!(authentication.identity && authentication.identity.status === 'none'));
                }
                resolve();
            });
        });
    };

    const advertiserInfo = () => {
        return new Promise(resolve => {
            requestWS({
                p2p_advertiser_info: 1,
            }).then(response => {
                if (!response.error) {
                    const { p2p_advertiser_info } = response;
                    setAdvertiserInfo(p2p_advertiser_info);
                    setNickname(p2p_advertiser_info.name);
                    setIsLoading(false);
                }
                resolve();
            });
        });
    };

    const advertiserStats = () => {
        return new Promise(resolve => {
            requestWS({
                p2p_advertiser_stats: 1,
                id,
            }).then(response => {
                const { p2p_advertiser_stats } = response;
                setStats(p2p_advertiser_stats);
                resolve();
            });
        });
    };

    const handleSubmit = values => {
        return new Promise(resolve => {
            requestWS({
                p2p_advertiser_update: 1,
                contact_info: values.contact_info,
                payment_info: values.payment_info,
                default_advert_description: values.default_advert_description,
            });
            resolve();
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

        const error_messages = field_name => [
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
                        errors[key] = error_messages(mapped_key[key])[error_index];
                        break;
                    default: {
                        errors[key] = error_messages[error_index];
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
    if (!(nickname && has_poi)) {
        return (
            <Empty title={localize('You are not verified.')}>
                <Button primary large onClick={() => changeTab(2)}>
                    <Localize i18n_default_text='Verify' />
                </Button>
            </Empty>
        );
    }
    return (
        <div className='my-profile'>
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
                    <div>
                        {localize('ID verified')}
                        <Icon
                            className='my-profile__header-verification-icon'
                            icon='IcCashierVerificationBadge'
                            size={16}
                        />
                    </div>
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
            <Table>
                <Table.Row className='my-profile__stats'>
                    {/* TODO: add daily buy and sell limits */}
                    {/* <div className='my-profile__stats-cell-separator' />
                    <Table.Cell className='my-profile__stats-cell'>
                        <div className='my-profile__stats-cell-header'>{localize('Daily Limit')}</div>
                        <div className='my-profile__stats-cell-info'>{Math.floor(daily_buy_limit) || '-'}</div>
                    </Table.Cell> */}
                    <div className='my-profile__stats-cell-separator' />
                    <Table.Cell className='my-profile__stats-cell'>
                        <div className='my-profile__stats-cell-header'>{localize('Total Trades')}</div>
                        <div className='my-profile__stats-cell-info'>{total_orders_count || '-'}</div>
                    </Table.Cell>
                    <div className='my-profile__stats-cell-separator' />
                    <Table.Cell className='my-profile__stats-cell'>
                        <div className='my-profile__stats-cell-header'>{localize('Sell')}</div>
                        <div className='my-profile__stats-cell-info'>{sell_orders_count || '-'}</div>
                    </Table.Cell>
                    <div className='my-profile__stats-cell-separator' />
                    <Table.Cell className='my-profile__stats-cell'>
                        <div className='my-profile__stats-cell-header'>{localize('Buy')}</div>
                        <div className='my-profile__stats-cell-info'>{buy_orders_count || '-'}</div>
                    </Table.Cell>
                    <div className='my-profile__stats-cell-separator' />
                </Table.Row>
            </Table>
            <div className='my-profile__separator'>
                <div className='my-profile__separator-text'>{localize('Ad template')}</div>
                <div className='my-profile__separator-horizontal_line' />
            </div>
            <Formik
                initialValues={{
                    contact_info,
                    default_advert_description,
                    payment_info,
                }}
                onSubmit={handleSubmit}
                isInitialValid={false}
                validate={validateForm}
            >
                {({ errors, isSubmitting, isValid, resetForm }) => {
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
                                    <Button className='my-profile__footer-button' secondary large onClick={resetForm}>
                                        {localize('Cancel')}
                                    </Button>
                                    <Button
                                        className='my-profile__footer-button'
                                        primary
                                        large
                                        is_disabled={isSubmitting || !isValid}
                                    >
                                        {localize('Save')}
                                    </Button>
                                </FooterActions>
                            </React.Fragment>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
};

export default MyProfile;
