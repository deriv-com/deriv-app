import React from 'react';
import { connect } from 'Stores/connect';
import { Dialog, Text, Button, Icon } from '@deriv/components';
import { Localize } from '@deriv/translations';
import PropTypes from 'prop-types';
import './close-mx-account-modal.scss';

export const CloseMXAccountContent = ({
    is_uk,
    is_eu,
    is_fullscreen = false,
    showCloseMXAccountPopup,
    removeNotificationMessageByKey,
}) => {
    const HeaderText = () => {
        if (is_uk) {
            return <Localize i18n_default_text='Your Gaming account is scheduled to be closed' />;
        } else if (is_eu) {
            return <Localize i18n_default_text='Your Options account is scheduled to be closed' />;
        }
        return <Localize i18n_default_text='Your account is scheduled to be closed' />;
    };
    const ProductLineupText = () => {
        if (is_uk) {
            return (
                <Localize i18n_default_text='As part of the changes in our product line-up, we will be closing Gaming accounts belonging to our UK clients.' />
            );
        } else if (is_eu) {
            return (
                <Localize i18n_default_text='As part of the changes in our product line-up, we will be closing Options accounts belonging to our clients in Europe.' />
            );
        }
        return (
            <Localize i18n_default_text='As part of the changes in our product line-up, we will be closing accounts belonging to our Isle of Man clients.' />
        );
    };
    const NoDigitalOptionsText = () => {
        if (is_uk) {
            return (
                <Localize i18n_default_text='You are no longer able to trade digital options on any of our platforms. Also, you can’t make deposits into your Gaming account.' />
            );
        } else if (is_eu) {
            return (
                <Localize i18n_default_text='You are no longer able to trade digital options on any of our platforms. Also, you can’t make deposits into your Options account.' />
            );
        }
        return (
            <Localize i18n_default_text='You are no longer able to trade digital options on any of our platforms. Also, you can’t make deposits into your account.' />
        );
    };
    const OptionsAccountClosedText = () => {
        if (is_uk) {
            return (
                <Localize i18n_default_text='You will lose access to your Gaming account when it gets closed, so be sure to withdraw all your funds. (If you have a CFDs account, you can also transfer the funds from your Gaming account to your CFDs account.)' />
            );
        } else if (is_eu) {
            return (
                <Localize i18n_default_text='You will lose access to your Options account when it gets closed, so be sure to withdraw all your funds. (If you have a CFDs account, you can also transfer the funds from your Options account to your CFDs account.)' />
            );
        }
        return (
            <Localize i18n_default_text='You will lose access to your account when it gets closed, so be sure to withdraw all your funds.' />
        );
    };

    return (
        <>
            <div className='close-mx-account-header'>
                <Icon icon='IcAmplifier' />
                <Text as='h1' weight='bold' className='close-mx-account-header__heading' align='center'>
                    <HeaderText />
                </Text>
            </div>
            <div className='close-mx-account__content'>
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
                    <Localize i18n_default_text='Withdraw all your funds' />
                </Text>
                <Text align='left' as='p' size='s'>
                    <OptionsAccountClosedText />
                </Text>
            </div>
            <div className='close-mx-account dc-dialog__footer'>
                <Button
                    className='continue-button'
                    onClick={() => {
                        showCloseMXAccountPopup(false);
                        localStorage.setItem('hide_close_mx_account_notification', '1');
                        removeNotificationMessageByKey({ key: 'close_mx_account' });
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

const CloseMXAccountModal = ({
    is_logged_in,
    is_loading,
    is_uk,
    is_eu,
    is_close_mx_account_modal_visible,
    removeNotificationMessageByKey,
    showCloseMXAccountPopup,
}) => {
    const [is_visible, setVisible] = React.useState(false);

    React.useEffect(() => {
        if (is_logged_in && is_close_mx_account_modal_visible) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    }, [is_logged_in, is_close_mx_account_modal_visible]);

    return (
        <div className='close-mx-account'>
            <Dialog is_visible={is_visible} is_loading={is_loading} is_uk={is_uk} is_eu={is_eu}>
                <CloseMXAccountContent
                    is_uk={is_uk}
                    is_eu={is_eu}
                    showCloseMXAccountPopup={showCloseMXAccountPopup}
                    removeNotificationMessageByKey={removeNotificationMessageByKey}
                />
            </Dialog>
        </div>
    );
};

CloseMXAccountModal.propTypes = {
    is_loading: PropTypes.bool,
    is_logged_in: PropTypes.bool,
    is_close_mx_account_modal_visible: PropTypes.bool,
};

export default connect(({ client, ui }) => ({
    is_close_mx_account_modal_visible: ui.is_close_mx_account_modal_visible,
    is_loading: ui.is_loading,
    is_logged_in: client.is_logged_in,
    is_uk: client.is_uk,
    is_eu: client.is_eu,
    removeNotificationMessageByKey: ui.removeNotificationMessageByKey,
    showCloseMXAccountPopup: ui.showCloseMXAccountPopup,
}))(CloseMXAccountModal);
