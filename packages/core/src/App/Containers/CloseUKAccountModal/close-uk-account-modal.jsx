import React from 'react';
import { connect } from 'Stores/connect';
import { Dialog, Text, Button } from '@deriv/components';
import { Localize } from '@deriv/translations';
import PropTypes from 'prop-types';
import { isMobile } from '@deriv/shared';
import './close-uk-account-modal.scss';

export const CloseUKAccountContent = ({ showCloseUKAccountPopup, removeNotificationMessageByKey }) => {
    const BulletData = () => (
        <ol className='dc-text__bullet_list'>
            <li className='dc-text__bullet_content'>
                <Text size={isMobile() ? 'xxs' : 'xs'} weight='bold'>
                    <Localize i18n_default_text='Close all your positions before 25 Apr, 12:00 am GMT' />
                </Text>
                <Text size={isMobile() ? 'xxs' : 'xs'} as='p' line_height='s' className='dc-text__bullet_desc'>
                    <Localize i18n_default_text='If you still have open positions on 25 Apr 2022, 12:00 am GMT, we shall close them and refund you.' />
                </Text>
            </li>
            <li className='dc-text__bullet_content'>
                <Text size={isMobile() ? 'xxs' : 'xs'} weight='bold'>
                    <Localize i18n_default_text=' Withdraw your funds from your Deriv account' />
                </Text>
                <Text size={isMobile() ? 'xxs' : 'xs'} as='p' line_height='s' className='dc-text__bullet_desc'>
                    <Localize i18n_default_text='You will lose access to your account when it gets closed, so be sure to withdraw all your funds.' />
                </Text>
            </li>
        </ol>
    );

    return (
        <>
            <div className='close-uk-account-header'>
                <Text
                    as='h1'
                    weight='bold'
                    className='close-uk-account-header__heading'
                    align='left'
                    size={isMobile() ? 'xxs' : 's'}
                >
                    <Localize i18n_default_text='Your account is scheduled to be closed' />
                </Text>
            </div>
            <div className='close-uk-account__content'>
                <Text as='p' size={isMobile() ? 'xxs' : 'xs'}>
                    <Localize i18n_default_text='As part of the changes in our market offerings, we will be closing our UK clients’ accounts.' />
                </Text>
                <br />
                <Text align='left' weight='bold' as='p' size={isMobile() ? 'xxs' : 'xs'}>
                    <Localize i18n_default_text='What this means for you' />
                </Text>
                <Text as='p' size={isMobile() ? 'xxs' : 'xs'}>
                    <Localize i18n_default_text='From 25 Apr 2022 onwards, you won’t be able to trade on Deriv. Also, you won’t be able to make deposits into your Deriv account. You need to withdraw any funds from your account as soon as possible.' />
                </Text>
                <br />
                <Text align='left' weight='bold' as='p' size={isMobile() ? 'xxs' : 'xs'}>
                    <Localize i18n_default_text='What you need to do now' />;
                </Text>
                <BulletData />
            </div>
            <div className='close-uk-account dc-dialog__footer'>
                <Button
                    className='continue-button'
                    onClick={() => {
                        showCloseUKAccountPopup(false);
                        removeNotificationMessageByKey({ key: 'close_uk_account' });
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

const CloseUKAccountModal = ({
    is_logged_in,
    is_loading,
    is_close_uk_account_modal_visible,
    removeNotificationMessageByKey,
    showCloseUKAccountPopup,
}) => {
    const [is_visible, setIsVisible] = React.useState(false);

    React.useEffect(() => {
        setIsVisible(is_logged_in && is_close_uk_account_modal_visible);
    }, [is_logged_in, is_close_uk_account_modal_visible]);

    return (
        <div className='close-uk-account'>
            <Dialog is_visible={is_visible} is_loading={is_loading}>
                <CloseUKAccountContent
                    showCloseUKAccountPopup={showCloseUKAccountPopup}
                    removeNotificationMessageByKey={removeNotificationMessageByKey}
                />
            </Dialog>
        </div>
    );
};

CloseUKAccountModal.propTypes = {
    is_loading: PropTypes.bool,
    is_logged_in: PropTypes.bool,
    is_close_uk_account_modal_visible: PropTypes.bool,
};

export default connect(({ client, notifications, ui }) => ({
    is_close_uk_account_modal_visible: ui.is_close_uk_account_modal_visible,
    is_loading: ui.is_loading,
    is_logged_in: client.is_logged_in,
    removeNotificationMessageByKey: notifications.removeNotificationMessageByKey,
    showCloseUKAccountPopup: ui.showCloseUKAccountPopup,
}))(CloseUKAccountModal);
