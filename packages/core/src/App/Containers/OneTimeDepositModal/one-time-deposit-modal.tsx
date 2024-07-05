import React from 'react';
import { useDevice } from '@deriv-com/ui';
import { MobileFullPageModal, Modal } from '@deriv/components';
import { useCryptoTransactions, useCurrentCurrencyConfig } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import DepositNowOrLaterModal from '../Modals/deposit-now-or-later-modal';
import { OneTimeDepositModalContent } from './one-time-deposit-modal-content';
import './one-time-deposit-modal.scss';

const OneTimeDepositModal = observer(() => {
    const { isDesktop } = useDevice();
    const store = useStore();
    const { client, ui } = store;
    const { is_cr_account, is_logged_in, balance } = client;
    const {
        should_show_one_time_deposit_modal,
        setShouldShowOneTimeDepositModal,
        setShouldShowDepositNowOrLaterModal,
    } = ui;

    const currency_config = useCurrentCurrencyConfig();
    const is_crypto_account = is_cr_account && currency_config?.is_crypto;
    const { data: crypto_transactions, has_transactions } = useCryptoTransactions(is_logged_in && is_crypto_account);
    const [is_account_deposited, setIsAccountDeposited] = React.useState(false);

    const onCloseModal = () => {
        if (is_account_deposited) setShouldShowOneTimeDepositModal(false);
        else setShouldShowDepositNowOrLaterModal(true);
    };

    // check the user already made a deposit
    React.useEffect(() => {
        if (balance && Number(balance) > 10000) {
            setIsAccountDeposited(true);
        }

        // check crypto transactions
        if (is_cr_account && currency_config?.is_crypto && crypto_transactions && has_transactions) {
            if (crypto_transactions?.some(tx => tx.is_deposit)) setIsAccountDeposited(true);
        }
    }, [balance, crypto_transactions, currency_config, is_cr_account, has_transactions, setIsAccountDeposited]);

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
                    <Modal.Body className='one-time-deposit-modal__body'>
                        <OneTimeDepositModalContent is_crypto_account={is_crypto_account} />
                    </Modal.Body>
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
                    <OneTimeDepositModalContent is_crypto_account={is_crypto_account} />
                </MobileFullPageModal>
            )}
            <DepositNowOrLaterModal />
        </React.Fragment>
    );
});

export default OneTimeDepositModal;
