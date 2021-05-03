import React from 'react';
import { observer } from 'mobx-react-lite';
import { Modal, Text, Icon, Button } from '@deriv/components';
import { localize } from '@deriv/translations';
import { useStores } from 'Stores';

type TGetPasswordModal = {
    app_title: string;
    app_icon: string;
};

const GetPasswordModal: React.FC<TGetPasswordModal> = ({ app_title, app_icon }: TGetPasswordModal) => {
    const { ui_store, mt5_store } = useStores();

    const [wallets] = React.useState([
        'IcWalletSkrillLight',
        'IcWalletCreditDebitLight',
        'IcWalletCryptoLight',
        'IcWalletPaymentAgentLight',
        'IcWalletNetellerLight',
        'IcWalletZingpayLight',
        'IcWalletJetonLight',
        'IcWalletSticpayLight',
        'IcWalletPaytrustLight',
        'IcWalletDp2pLight',
        'IcWalletWebmoneyLight',
        'IcWalletFasapayLight',
        'IcWalletSkrillLight',
        'IcWalletCreditDebitLight',
        'IcWalletCryptoLight',
    ]);

    const { is_get_wallet_modal_open, disableGetPasswordModal } = ui_store;
    const { beginRealSignupForMt5 } = mt5_store;

    const closeModal = () => {
        disableGetPasswordModal();
    };

    const onClickGetWallet = () => {
        disableGetPasswordModal();
        beginRealSignupForMt5();
    };

    return (
        <Modal
            className='dw-get-wallet-modal'
            is_open={is_get_wallet_modal_open}
            width={'544px'}
            toggleModal={closeModal}
            has_close_icon
        >
            <Modal.Body>
                <div className='dw-get-wallet-modal__body'>
                    <Text className='dw-get-wallet-modal__title' size='m' weight='bold' align='center'>
                        {localize('Get a Wallet to fund your app')}
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
                                <div className='dw-get-wallet-modal__selected-app-title-wrapper'>
                                    <div className='dw-get-wallet-modal__selected-app-title'>
                                        <Icon icon={app_icon} size={24} />
                                        <Text size='xs' weight='bold'>
                                            {app_title}
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
                <Button has_effect text={localize('Get a Wallet')} primary onClick={onClickGetWallet} />
            </Modal.Footer>
        </Modal>
    );
};

export default observer(GetPasswordModal);
