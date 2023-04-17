import React from 'react';
import { Dialog, Text, Button, Icon } from '@deriv/components';
import { Localize } from '@deriv/translations';
import './close-mx-mlt-account-modal.scss';
import classNames from 'classnames';
import { observer, useStore } from '@deriv/stores';

export const CloseMxMltAccountContent = ({
    country_standpoint,
    is_fullscreen = false,
    showCloseMxMltAccountPopup,
    removeNotificationMessageByKey,
    has_malta_account,
    can_have_mlt_account,
}) => {
    const HeaderText = () => {
        if (country_standpoint.is_united_kingdom) {
            return <Localize i18n_default_text='Your Gaming account is scheduled to be closed' />;
        } else if (has_malta_account || can_have_mlt_account) {
            return <Localize i18n_default_text='Your Options account is scheduled to be closed' />;
        }
        return <Localize i18n_default_text='Your account is scheduled to be closed' />;
    };

    const ProductLineupText = () => {
        if (country_standpoint.is_united_kingdom) {
            return (
                <Localize i18n_default_text='As part of the changes in our product line-up, we will be closing Gaming accounts belonging to our UK clients.' />
            );
        } else if (has_malta_account || can_have_mlt_account) {
            return (
                <Localize i18n_default_text='As part of the changes in our product line-up, we are closing Options accounts belonging to our clients in Europe.' />
            );
        }
        return (
            <Localize i18n_default_text='As part of the changes in our product line-up, we will be closing accounts belonging to our Isle of Man clients.' />
        );
    };
    const NoDigitalOptionsText = () => {
        if (has_malta_account || can_have_mlt_account) {
            return (
                <Localize i18n_default_text='You are no longer able to trade digital options on any of our platforms. Also, you can’t make deposits into your Options account.' />
            );
        }
        return (
            <Localize
                i18n_default_text='You can no longer trade digital options on any of our platforms. You also can’t deposit funds into your account.<0/><1/>Any open positions on digital options have been closed with full payout.'
                components={[<br key={0} />, <br key={1} />]}
            />
        );
    };
    const OptionsAccountClosedText = () => {
        if (country_standpoint.is_united_kingdom) {
            return (
                <Localize i18n_default_text='You’ll lose access to your Gaming account when it gets closed, so make sure to withdraw your funds as soon as possible.' />
            );
        } else if (has_malta_account || can_have_mlt_account) {
            return (
                <Localize i18n_default_text='You will lose access to your Options account when it gets closed, so be sure to withdraw all your funds. (If you have a CFDs account, you can also transfer the funds from your Options account to your CFDs account.)' />
            );
        }
        return (
            <Localize
                i18n_default_text='Please proceed to withdraw all your funds from your account before <0>30 November 2021.</0>'
                components={[<strong key={0} />]}
            />
        );
    };

    const OptionsAccountHeaderText = () => {
        if (country_standpoint.is_united_kingdom || country_standpoint.is_isle_of_man) {
            return <Localize i18n_default_text='What you need to do now' />;
        }
        return <Localize i18n_default_text='Withdraw all your funds' />;
    };

    return (
        <>
            <div className='close-mx-mlt-account-header'>
                <Icon icon='IcAmplifier' />
                <Text as='h1' weight='bold' className='close-mx-mlt-account-header__heading' align='center'>
                    <HeaderText />
                </Text>
            </div>
            <div className='close-mx-mlt-account__content'>
                <Text as='p' size='s'>
                    <ProductLineupText />
                </Text>
                <br />
                <Text align='left' weight='bold' as='p' size='s'>
                    <Localize i18n_default_text='What this means for you' />
                </Text>
                <Text as='p' size='s'>
                    <NoDigitalOptionsText />
                </Text>
                <br />
                <Text align='left' weight='bold' as='p' size='s'>
                    <OptionsAccountHeaderText />
                </Text>
                <Text align='left' as='p' size='s'>
                    <OptionsAccountClosedText />
                </Text>
            </div>
            <div
                className={classNames({
                    'dc-dialog__footer': !is_fullscreen,
                    'close-mx-mlt-account': true,
                })}
            >
                <Button
                    className='continue-button'
                    onClick={() => {
                        localStorage.setItem('hide_close_mx_mlt_account_notification', '1');
                        showCloseMxMltAccountPopup(false);
                        removeNotificationMessageByKey({ key: 'close_mx_mlt_account' });
                        if (is_fullscreen) {
                            window.location.reload();
                        }
                    }}
                    primary
                    large
                >
                    <Localize i18n_default_text='OK, I understand' />
                </Button>
            </div>
        </>
    );
};

const CloseMxMltAccountModal = observer(() => {
    const { client, notifications, ui } = useStore();
    const { is_logged_in, has_malta_account, can_have_mlt_account, country_standpoint } = client;
    const { is_close_mx_mlt_account_modal_visible, is_loading, showCloseMxMltAccountPopup } = ui;
    const { removeNotificationMessageByKey } = notifications;
    const [is_visible, setVisible] = React.useState(false);

    React.useEffect(() => {
        if (is_logged_in && is_close_mx_mlt_account_modal_visible) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    }, [is_logged_in, is_close_mx_mlt_account_modal_visible]);

    return (
        <div className='close-mx-mlt-account'>
            <Dialog
                is_visible={is_visible}
                is_loading={is_loading}
                country_standpoint={country_standpoint}
                has_malta_account={has_malta_account}
                can_have_mlt_account={can_have_mlt_account}
            >
                <CloseMxMltAccountContent
                    country_standpoint={country_standpoint}
                    has_malta_account={has_malta_account}
                    can_have_mlt_account={can_have_mlt_account}
                    showCloseMxMltAccountPopup={showCloseMxMltAccountPopup}
                    removeNotificationMessageByKey={removeNotificationMessageByKey}
                />
            </Dialog>
        </div>
    );
});

export default CloseMxMltAccountModal;
