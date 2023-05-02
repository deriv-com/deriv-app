import React from 'react';
import { Modal } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import CashierWalletModalHeader from './cashier-wallet-modal-header';
import CashierWalletModalBody from './cashier-wallet-modal-body';
import { observer, useStore } from '@deriv/stores';

const CashierWalletModal = observer(() => {
    const store = useStore();
    const {
        client: { balance, currency },
        ui: { is_dark_mode_on, is_cashier_wallet_modal_visible, setIsCashierWalletModalVisible },
        traders_hub: { is_demo },
    } = store;

    // TODO: Temporary wallet type. Will be refactored later. Add correct type
    const wallet_type = is_demo ? 'demo' : 'real';

    const tab_content_ref = React.useRef<HTMLDivElement>(null);
    const [active_tab_index, setActiveTabIndex] = React.useState<number>(0);
    const [show_wallet_name, setShowWalletName] = React.useState<boolean>(true);

    const closeModal = () => {
        setIsCashierWalletModalVisible(false);
        setActiveTabIndex(0);
    };

    //TODO: refactor in one useEffect
    React.useEffect(() => {
        const el_tab_content = tab_content_ref.current;

        const handleScroll = (e: Event) => {
            const target = e.target as HTMLDivElement;
            setShowWalletName(!(target.scrollTop > 0));
        };

        el_tab_content?.addEventListener('scroll', handleScroll);

        return () => {
            el_tab_content?.removeEventListener('scroll', handleScroll);
        };
    }, [active_tab_index, is_cashier_wallet_modal_visible]);

    React.useEffect(() => {
        if (isMobile()) {
            setShowWalletName(true);
        }
    }, [active_tab_index, is_cashier_wallet_modal_visible]);

    return (
        <Modal is_open={is_cashier_wallet_modal_visible} className='cashier-wallet-modal' portalId='app_contents'>
            <CashierWalletModalHeader
                balance={balance}
                closeModal={closeModal}
                currency={currency}
                is_dark={is_dark_mode_on}
                is_demo={is_demo}
                show_wallet_name={show_wallet_name}
            />
            <CashierWalletModalBody
                active_tab_index={active_tab_index}
                is_dark={is_dark_mode_on}
                is_demo={is_demo}
                ref={tab_content_ref}
                setActiveTabIndex={setActiveTabIndex}
                wallet_type={wallet_type}
            />
        </Modal>
    );
});

export default CashierWalletModal;
