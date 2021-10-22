import React from 'react';
import { connect } from 'Stores/connect';
import { Dialog, Text, Button, Icon } from '@deriv/components';
import { Localize } from '@deriv/translations';
import PropTypes from 'prop-types';
import './close-mx-account-modal.scss';

const ModalHeader = () => {
    return (
        <div className='close-mx-account-header'>
            <Icon icon='IcAmplifier' />
            <Text as='h1' weight='bold' className='close-mx-account-header__heading' align='center'>
                <Localize i18n_default_text='Your Gaming account is scheduled to be closed' />
            </Text>
        </div>
    );
};

const CloseMXAccountModal = ({
    is_logged_in,
    is_loading,
    is_close_mx_account_modal_visible,
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
            <Dialog is_visible={is_visible} is_loading={is_loading}>
                <ModalHeader />
                <div className='close-mx-account__content'>
                    <Text as='p' size='s'>
                        <Localize i18n_default_text='As part of the changes in our product line-up, we will be closing Gaming accounts belonging to our UK clients.' />
                    </Text>
                    <br />
                    <Text align='left' weight='bold' as='p' size='s'>
                        <Localize i18n_default_text='What this means for you' />
                    </Text>
                    <br />
                    <Text as='p' size='s'>
                        <Localize i18n_default_text='You can no longer trade digital options on any of our platforms. You also can’t deposit funds into your account.' />
                    </Text>
                    <br />
                    <Text as='p' size='s'>
                        <Localize i18n_default_text='Any open positions on digital options have been closed with full payout.' />
                    </Text>
                    <br />
                    <Text align='left' weight='bold' as='p' size='s'>
                        <Localize i18n_default_text='What you need to do now' />
                    </Text>
                    <br />
                    <Text as='p' size='s'>
                        <Localize
                            i18n_default_text='Please proceed to withdraw all your funds from your Gaming account before <0>30 November 2021.</0>'
                            components={[<strong key='0' />]}
                        />
                    </Text>
                </div>
                <div className='close-mx-account dc-dialog__footer'>
                    <Button
                        className='continue-button'
                        onClick={() => {
                            showCloseMXAccountPopup(false);
                            localStorage.setItem('hide_close_mx_account_notification', '1');
                        }}
                        primary
                        large
                    >
                        <Localize i18n_default_text='OK, I understand' />
                    </Button>
                </div>
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
    is_loading: ui.is_loading,
    is_close_mx_account_modal_visible: ui.is_close_mx_account_modal_visible,
    showCloseMXAccountPopup: ui.showCloseMXAccountPopup,
    is_logged_in: client.is_logged_in,
}))(CloseMXAccountModal);
