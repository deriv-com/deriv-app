import React, { useEffect } from 'react';
import { Modal, Loading } from '@deriv/components';
import WalletModalHeader from './wallet-modal-header';
import WalletModalBody from './wallet-modal-body';
import { observer, useStore } from '@deriv/stores';
import { useActiveWallet } from '@deriv/hooks';
import debounce from 'lodash.debounce';

const WalletModal = observer(() => {
    const store = useStore();

    const {
        client: { balance, currency, landing_company_shortcode: shortcode, is_authorize, switchAccount },
        ui: { is_dark_mode_on, is_wallet_modal_visible, is_mobile, setIsWalletModalVisible },
        traders_hub: { active_modal_tab, active_modal_wallet_id, setWalletModalActiveTab },
    } = store;

    const wallet = useActiveWallet();

    useEffect(() => {
        if (wallet?.loginid !== active_modal_wallet_id) {
            /** Adding a delay as per requirement because the modal must appear first, then switch the account */
            debounce(switchAccount, 200)(active_modal_wallet_id);
        }
    }, [active_modal_wallet_id, switchAccount, wallet?.loginid]);

    const is_demo = wallet?.is_demo || false;
    const wallet_type = is_demo ? 'demo' : 'real';

    const [is_wallet_name_visible, setIsWalletNameVisible] = React.useState<boolean>(true);

    React.useEffect(() => {
        return setIsWalletNameVisible(true);
    }, [active_modal_tab, is_wallet_modal_visible]);

    const closeModal = () => {
        setIsWalletModalVisible(false);
        setWalletModalActiveTab(undefined);
    };

    const contentScrollHandler = React.useCallback(
        (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
            if (is_mobile && is_wallet_modal_visible) {
                const target = e.target as HTMLDivElement;
                setIsWalletNameVisible(!(target.scrollTop > 0));
            }
        },
        [is_mobile, is_wallet_modal_visible]
    );

    const ModalContent = () => {
        if (wallet?.loginid !== active_modal_wallet_id) return <Loading is_fullscreen={false} />;

        if (!is_authorize) return <Loading is_fullscreen={false} />;

        return (
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
        );
    };

    return (
        <Modal is_open={is_wallet_modal_visible} className='wallet-modal' portalId='deriv_app'>
            <ModalContent />
        </Modal>
    );
});

export default WalletModal;
