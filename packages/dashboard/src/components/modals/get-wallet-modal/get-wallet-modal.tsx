import React from 'react';
import { Modal, Text, Icon, Button } from '@deriv/components';
import { localize } from '@deriv/translations';
import { useStores } from 'Stores';

const GetPasswordModal: React.FC = () => {
    // const closeModal = () => {
    //     closeDialogs();
    // };

    // const closeOpenSuccess = () => {
    //     disableMt5PasswordModal();
    //     closeDialogs();
    //     if (account_type.category === 'real') {
    //         history.push(routes.cashier_acc_transfer);
    //     }
    // };
    const { config_store } = useStores();

    const [wallets] = React.useState([
        'IcWalletSkrill',
        'IcWalletCreditDebit',
        'IcWalletCrypto',
        'IcWalletPaymentAgent',
        'IcWalletNeteller',
        'IcWalletZingpay',
        'IcWalletJeton',
        'IcWalletSticpay',
        'IcWalletPaytrust',
        'IcWalletDp2p',
        'IcWalletWebmoney',
        'IcWalletFasapay',
        'IcWalletSkrill',
        'IcWalletCreditDebit',
        'IcWalletCrypto',
    ]);

    return (
        <Modal
            className='dw-get-wallet-modal'
            is_open={false}
            width={'544px'}
            // toggleModal={closeModal}
            has_close_icon
        >
            <Modal.Body>
                <div className='dw-get-wallet-modal__body'>
                    <Text className='dw-get-wallet-modal__title' size='m' weight='bold' align='center'>
                        Get a Wallet to fund your app
                    </Text>
                    <div className='dw-get-wallet-modal__content'>
                        <div className='dw-get-wallet-modal__wallet-list'>
                            {wallets.map((wallet, i) => (
                                <div key={`${wallet}${i}`} className='dw-get-wallet-modal__wallet'>
                                    <Icon icon={wallet} />
                                </div>
                            ))}
                        </div>
                        <div className='dw-get-wallet-modal__selected-app-wrapper'>
                            <div className='dw-get-wallet-modal__selected-app'>
                                <img
                                    className='dw-get-wallet-modal__selected-app-background'
                                    src={`${config_store.asset_path}/images/app-card-bg.svg`}
                                />
                                <div className='dw-get-wallet-modal__selected-app-title-wrapper'>
                                    <div className='dw-get-wallet-modal__selected-app-title'>
                                        <Text size='xs' weight='bold'>
                                            {localize('DMT5 Synthetic')}
                                        </Text>
                                    </div>
                                </div>
                                <div className='dw-get-wallet-modal__selected-app-footer'>
                                    <Text size='xs' weight='bold' line-height='xl'>
                                        -.--
                                    </Text>
                                    <Text size='xxs' line-height='s'>
                                        {localize('Linked wallet: -')}
                                    </Text>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer has_separator>
                <Button has_effect text={localize('Get a Wallet')} primary />
            </Modal.Footer>
        </Modal>
    );
};

export default GetPasswordModal;
