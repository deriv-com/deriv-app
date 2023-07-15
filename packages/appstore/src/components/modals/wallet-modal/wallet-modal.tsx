import React, { useEffect } from 'react';
import { Modal, Loading } from '@deriv/components';
import WalletModalHeader from './wallet-modal-header';
import WalletModalBody from './wallet-modal-body';
import { observer, useStore } from '@deriv/stores';
import { useActiveWallet } from '@deriv/hooks';

const WalletModal = observer(() => {
    const store = useStore();

    const {
        client: { balance, currency, landing_company_shortcode: shortcode, is_authorize, switchAccount },
        ui: { is_dark_mode_on, is_wallet_modal_visible, is_mobile, setIsWalletModalVisible },
        traders_hub: { active_modal_tab, active_modal_wallet_id, setWalletModalActiveTab },
    } = store;

    const wallet = useActiveWallet();

    useEffect(() => {
        let timeout_id: NodeJS.Timeout;
        if (is_wallet_modal_visible && wallet?.loginid !== active_modal_wallet_id) {
            /** Adding a delay as per requirement because the modal must appear first, then switch the account */
            timeout_id = setTimeout(() => switchAccount(active_modal_wallet_id), 700);
        }

        return () => clearTimeout(timeout_id);
    }, [active_modal_wallet_id, is_wallet_modal_visible, switchAccount, wallet?.loginid]);

    const is_demo = wallet?.is_demo || false;
    const wallet_type = is_demo ? 'demo' : 'real';

    const [is_wallet_name_visible, setIsWalletNameVisible] = React.useState<boolean>(true);

    React.useEffect(() => {
        return setIsWalletNameVisible(true);
    }, [active_modal_tab, is_wallet_modal_visible]);

    const closeModal = () => {
        setIsWalletModalVisible(false);
        setWalletModalActiveTab(active_modal_tab);
    };

    const contentScrollHandler = React.useCallback(
        (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
            if (is_mobile) {
                const target = e.target as HTMLDivElement;
                setIsWalletNameVisible(!(target.scrollTop > 0));
            }
        },
        [is_mobile]
    );

    return (
        <Modal is_open={is_wallet_modal_visible} className='wallet-modal' portalId='deriv_app'>
            {wallet?.loginid !== active_modal_wallet_id || !is_authorize ? (
                <Loading is_fullscreen={false} />
            ) : (
                <React.Fragment>
                    <WalletModalHeader
                        balance={balance}
                        closeModal={closeModal}
                        currency={currency}
                        is_dark={is_dark_mode_on}
                        is_demo={is_demo}
                        is_mobile={is_mobile}
                        shortcode={shortcode}
                        is_wallet_name_visible={is_wallet_name_visible}
                        gradient_class={wallet?.gradient_header_class || ''}
                    />
                    <WalletModalBody
                        contentScrollHandler={contentScrollHandler}
                        is_dark={is_dark_mode_on}
                        is_demo={is_demo}
                        is_mobile={is_mobile}
                        is_wallet_name_visible={is_wallet_name_visible}
                        setIsWalletNameVisible={setIsWalletNameVisible}
                        wallet_type={wallet_type}
                    />
                </React.Fragment>
            )}
        </Modal>
    );
});

export default WalletModal;
