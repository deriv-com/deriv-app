import React, { useState } from 'react';
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
import { useDepositFiatAddress } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import useLiveChat from 'App/Components/Elements/LiveChat/use-livechat';

const OneTimeDepositModal = observer(() => {
    const { data: iframe_url, isSuccess, isError } = useDepositFiatAddress();
    const [is_iframe_loading, setIsIframeLoading] = useState(true);
    const { client, ui } = useStore();
    const { loginid } = client;
    const {
        is_mobile,
        should_show_one_time_deposit_modal,
        setShouldShowOneTimeDepositModal,
        toggleAccountSuccessModal,
    } = ui;
    const liveChat = useLiveChat(false, loginid);

    React.useEffect(() => {
        setIsIframeLoading(true);
    }, [iframe_url]);

    React.useEffect(() => {
        if (isError) {
            onCloseModal();
        }
    }, [isError]);

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
                <Text as='p' size={is_mobile ? 'xs' : 's'}>
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
            {is_iframe_loading && <Loading is_fullscreen={false} />}
            {isSuccess && (
                <iframe
                    key={iframe_url}
                    className='one-time-deposit-modal__deposit-fiat-iframe'
                    src={iframe_url}
                    onLoad={() => setIsIframeLoading(false)}
                    style={{ display: is_iframe_loading ? 'none' : 'block' }}
                    data-testid='dt_deposit_fiat_iframe'
                />
            )}
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
