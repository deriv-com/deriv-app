import React, { useEffect } from 'react';
import { Loading, Modal } from '@deriv/components';
import { useActiveWallet } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import WalletModalHeader from './wallet-modal-header';
import WalletModalBody from './wallet-modal-body';

const WalletModal = observer(() => {
    const store = useStore();

    const {
        client: { is_authorize, switchAccount },
        ui: { is_dark_mode_on, is_wallet_modal_visible, is_mobile, setIsWalletModalVisible },
        traders_hub: { active_modal_tab, active_modal_wallet_id, setWalletModalActiveTab },
    } = store;

    const active_wallet = useActiveWallet();

    useEffect(() => {
        let timeout_id: NodeJS.Timeout;

        if (is_wallet_modal_visible && active_wallet?.loginid !== active_modal_wallet_id) {
            /** Adding a delay as per requirement because the modal must appear first, then switch the account */
            timeout_id = setTimeout(() => switchAccount(active_modal_wallet_id), 500);
        }

        return () => clearTimeout(timeout_id);
    }, [active_modal_wallet_id, active_wallet?.loginid, is_wallet_modal_visible, switchAccount]);

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
            if (is_mobile && is_wallet_modal_visible) {
                const target = e.target as HTMLDivElement;
                setIsWalletNameVisible(target.scrollTop <= 0);
            }
        },
        [is_mobile, is_wallet_modal_visible]
    );

    const is_loading = active_wallet?.loginid !== active_modal_wallet_id || !is_authorize || !active_wallet;

    return (
        <Modal is_open={is_wallet_modal_visible} className='wallet-modal' portalId='deriv_app'>
            {is_loading ? (
                <Loading is_fullscreen={false} />
            ) : (
                <React.Fragment>
                    <WalletModalHeader
                        closeModal={closeModal}
                        is_dark={is_dark_mode_on}
                        is_mobile={is_mobile}
                        is_wallet_name_visible={is_wallet_name_visible}
                        wallet={active_wallet}
                    />
                    <WalletModalBody
                        contentScrollHandler={contentScrollHandler}
                        is_dark={is_dark_mode_on}
                        is_mobile={is_mobile}
                        is_wallet_name_visible={is_wallet_name_visible}
                        setIsWalletNameVisible={setIsWalletNameVisible}
                        wallet={active_wallet}
                    />
                </React.Fragment>
            )}
        </Modal>
    );
});

export default WalletModal;
