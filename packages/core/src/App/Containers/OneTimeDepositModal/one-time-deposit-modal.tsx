import React from 'react';
import { Analytics } from '@deriv-com/analytics';
import { useDevice } from '@deriv-com/ui';
import { MobileFullPageModal, Modal } from '@deriv/components';
import { useCryptoTransactions, useCurrentCurrencyConfig } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import DepositNowOrLaterModal from '../Modals/deposit-now-or-later-modal';
import { OneTimeDepositModalContent } from './one-time-deposit-modal-content';
import CryptoTransactionProcessingModal from '../Modals/crypto-transaction-processing-modal';
import './one-time-deposit-modal.scss';

const OneTimeDepositModal = observer(() => {
    const { isDesktop } = useDevice();
    const { client, ui } = useStore();
    const { is_cr_account, is_logged_in, balance, currency, updateAccountStatus } = client;
    const {
        should_show_one_time_deposit_modal,
        setShouldShowOneTimeDepositModal,
        setShouldShowDepositNowOrLaterModal,
        setShouldShowCryptoTransactionProcessingModal,
    } = ui;

    const currency_config = useCurrentCurrencyConfig();
    const is_crypto_provider = currency_config?.platform.cashier.includes('crypto');
    const { data: crypto_transactions, has_transactions } = useCryptoTransactions(is_logged_in && is_crypto_provider);
    const [is_account_deposited, setIsAccountDeposited] = React.useState(false);

    const onCloseModal = () => {
        if (is_account_deposited) setShouldShowOneTimeDepositModal(false);
        else setShouldShowDepositNowOrLaterModal(true);
    };

    // check the user already made a deposit
    React.useEffect(() => {
        if (balance && Number(balance) > 0) {
            setIsAccountDeposited(true);
        }

        // check crypto transactions
        if (is_crypto_provider && crypto_transactions && has_transactions) {
            if (crypto_transactions?.some(tx => tx.is_deposit)) {
                setIsAccountDeposited(true);
            }

            if (crypto_transactions?.some(tx => tx.is_deposit && tx.status_code === 'PENDING')) {
                setShouldShowOneTimeDepositModal(false);
                setShouldShowCryptoTransactionProcessingModal(true);
            }
        }
    }, [
        balance,
        crypto_transactions,
        currency_config,
        is_crypto_provider,
        has_transactions,
        setIsAccountDeposited,
        setShouldShowOneTimeDepositModal,
        setShouldShowCryptoTransactionProcessingModal,
    ]);

    React.useEffect(() => {
        if (should_show_one_time_deposit_modal) {
            Analytics.trackEvent('ce_tradershub_popup', {
                action: 'open',
                form_name: 'traders_hub_default',
                account_mode: 'real',
                popup_name: 'direct_deposit',
                // @ts-expect-error currency propery will be added later
                currency,
            });

            return () => {
                updateAccountStatus();
            };
        }
    }, [should_show_one_time_deposit_modal]);

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
                    should_header_stick_body={false}
                >
                    <Modal.Body className='one-time-deposit-modal__body'>
                        <OneTimeDepositModalContent is_crypto_provider={is_crypto_provider} />
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
                    <OneTimeDepositModalContent is_crypto_provider={is_crypto_provider} />
                </MobileFullPageModal>
            )}
            <DepositNowOrLaterModal />
            <CryptoTransactionProcessingModal />
        </React.Fragment>
    );
});

export default OneTimeDepositModal;
