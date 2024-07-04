import React from 'react';
import { useDevice } from '@deriv-com/ui';
import { useInvalidateQuery, useTransactions } from '@deriv/api';
import { MobileFullPageModal, Modal, Text } from '@deriv/components';
import { useHasMFAccountDeposited, useCryptoTransactions, useCurrentCurrencyConfig } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import DepositFiatIframe from '@deriv/cashier/src/modules/deposit-fiat/components/deposit-fiat-iframe/deposit-fiat-iframe';
import useLiveChat from 'App/Components/Elements/LiveChat/use-livechat';
import DepositNowOrLaterModal from '../Modals/deposit-now-or-later-modal';

const OneTimeDepositModal = observer(() => {
    const { isDesktop } = useDevice();
    const { client, ui } = useStore();
    const { loginid, is_cr_account, is_mf_account, is_logged_in } = client;
    const {
        should_show_one_time_deposit_modal,
        setShouldShowOneTimeDepositModal,
        toggleAccountSuccessModal,
        setShouldShowDepositNowOrLaterModal,
    } = ui;
    const liveChat = useLiveChat(false, loginid);
    const currency_config = useCurrentCurrencyConfig();
    // const { has_mf_account_deposited } = useHasMFAccountDeposited();
    // const has_mf_account_deposited = false;
    const { data: crypto_transactions, has_transactions } = useCryptoTransactions(
        is_logged_in && is_cr_account && currency_config?.is_crypto
    );
    // const { has_deposit, updateStatement } = useStatement();

    const { data, dataUpdatedAt, fetchStatus, status, isFetching, isLoading } = useTransactions('deposit');
    const [is_account_deposited, setIsAccountDeposited] = React.useState(false);
    const [is_trying_to_close, setIsTryingToClose] = React.useState(false);
    const [data_updated, setDataUpdated] = React.useState(0);

    const invalidate = useInvalidateQuery();

    // console.log(
    //     // 'dataUpdatedAt = ',
    //     // dataUpdatedAt,
    //     // ', data_updated = ',
    //     // data_updated,
    //     ', fetchStatus = ',
    //     fetchStatus,
    //     ', status = ',
    //     status,
    //     ', isFetching = ',
    //     isFetching,
    //     ', isLoading = ',
    //     isLoading
    // );

    // React.useEffect(() => {
    //     if (has_mf_account_deposited) {
    //         onCloseModal();
    //     }
    // }, [has_mf_account_deposited]);

    // console.log('data = ', data);

    const onLiveChatClick = () => {
        liveChat.widget?.call('maximize');
    };

    const onCloseModal = async () => {
        // setShouldShowOneTimeDepositModal(false);
        // const res = await updateStatement();
        // console.log('res = ', res);
        // setDataUpdated(dataUpdatedAt);
        invalidate('statement');

        setIsTryingToClose(true);
        setShouldShowDepositNowOrLaterModal(true);

        return;

        if (!is_account_deposited) {
            // show confirm modal

            return;
        }

        setShouldShowOneTimeDepositModal(false);
        if (is_mf_account) toggleAccountSuccessModal();
    };

    // check the user already made a deposit
    React.useEffect(() => {
        // check statement
        if (data?.length) {
            setIsAccountDeposited(true);
            return;
        }

        // check crypto transactions
        if (is_cr_account && crypto_transactions && has_transactions) {
            if (crypto_transactions?.some(tx => tx.is_deposit)) setIsAccountDeposited(true);
        }
    }, [crypto_transactions, has_transactions, setIsAccountDeposited]);

    // check the flow when the user try to close the modal
    // React.useEffect(() => {
    //     if (is_trying_to_close) {
    //     }
    // }, [is_trying_to_close]);

    const getModalContent = () => (
        <div className='one-time-deposit-modal__content'>
            <div className='one-time-deposit-modal__title'>
                <Text as='h1' size={!isDesktop ? 'm' : 'l'} weight='bold'>
                    <Localize i18n_default_text='Deposit' />
                </Text>
                <Text size={!isDesktop ? 'xs' : 's'} align='center'>
                    <Localize
                        i18n_default_text='Select a payment method to make a deposit into your account.<0 />Need help? Contact us via <1>live chat</1>'
                        components={[
                            <br key={0} />,
                            <Text
                                key={1}
                                className='one-time-deposit-modal__livechat'
                                size={!isDesktop ? 'xs' : 's'}
                                color='loss-danger'
                                onClick={onLiveChatClick}
                                data-testid='dt_live_chat'
                            />,
                        ]}
                    />
                </Text>
            </div>
            {/* <DepositFiatIframe /> */}
        </div>
    );

    return (
        <React.Fragment>
            {isDesktop ? (
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
            ) : (
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
            )}
            <DepositNowOrLaterModal />
        </React.Fragment>
    );
});

export default OneTimeDepositModal;
