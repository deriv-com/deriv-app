import React from 'react';
import {
    Button,
    DesktopWrapper,
    Icon,
    InlineMessage,
    Loading,
    MobileFullPageModal,
    MobileWrapper,
    Modal,
    Text,
} from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import DepositFiatIframe from '@deriv/cashier/src/modules/deposit-fiat/components/deposit-fiat-iframe/deposit-fiat-iframe';
import useLiveChat from 'App/Components/Elements/LiveChat/use-livechat';

const OneTimeDepositModal = observer(() => {
    const { client, ui } = useStore();
    const { account_status, loginid, updateAccountStatus } = client;
    const {
        is_mobile,
        should_show_one_time_deposit_modal,
        setShouldShowOneTimeDepositModal,
        toggleAccountSuccessModal,
    } = ui;
    const liveChat = useLiveChat(false, loginid);

    /** fetch account_status every 2 seconds since we can't subscribe for status updates */
    React.useEffect(() => {
        const interval = setInterval(() => {
            updateAccountStatus();
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    React.useEffect(() => {
        const has_client_deposited = account_status?.status?.some(
            status => status === 'unwelcome' || status === 'withdrawal_locked' || status === 'cashier_locked'
        );
        if (has_client_deposited) {
            onCloseModal();
        }
    }, [account_status]);

    const onLiveChatClick = () => {
        liveChat.widget?.call('maximize');
    };

    const onCloseModal = () => {
        setShouldShowOneTimeDepositModal(false);
        toggleAccountSuccessModal();
    };

    const getModalContent = () => (
        <div className='one-time-deposit-modal__content'>
            <div className='one-time-deposit-modal__title'>
                <Text as='h1' size={is_mobile ? 'm' : 'l'} weight='bold'>
                    <Localize i18n_default_text='Deposit' />
                </Text>
                <Text as='p' size={is_mobile ? 'xs' : 's'} align='center'>
                    <Localize i18n_default_text='Account created. Select payment method for deposit.' />
                </Text>
            </div>
            <div className='one-time-deposit-modal__description'>
                <InlineMessage
                    type='information'
                    size='sm'
                    message={localize(
                        'We don’t charge deposit fees! Once your account is verified, you will be able to trade, make additional deposits, or withdraw funds.'
                    )}
                />
                <Button
                    className='one-time-deposit-modal__description--livechat'
                    data-testid='dt_live_chat'
                    onClick={onLiveChatClick}
                    transparent
                    type='button'
                >
                    <Icon
                        color='red'
                        icon='IcLiveChat'
                        className='one-time-deposit-modal__description--livechat-icon'
                    />
                    <Text color='loss-danger' size='xs' weight='bold'>
                        {localize('Live chat')}
                    </Text>
                </Button>
            </div>
            <DepositFiatIframe />
        </div>
    );

    return (
        <React.Fragment>
            <DesktopWrapper>
                <Modal
                    className='one-time-deposit-modal'
                    is_open={should_show_one_time_deposit_modal}
                    title=' '
                    toggleModal={onCloseModal}
                    height='auto'
                    has_close_icon
                >
                    <Modal.Body className='one-time-deposit-modal__body'>{getModalContent()}</Modal.Body>
                </Modal>
            </DesktopWrapper>
            <MobileWrapper>
                <MobileFullPageModal
                    className='one-time-deposit-modal'
                    body_className='one-time-deposit-modal__body'
                    header=' '
                    height_offset='80px'
                    is_modal_open={should_show_one_time_deposit_modal}
                    onClickClose={onCloseModal}
                >
                    {getModalContent()}
                </MobileFullPageModal>
            </MobileWrapper>
        </React.Fragment>
    );
});

export default OneTimeDepositModal;
