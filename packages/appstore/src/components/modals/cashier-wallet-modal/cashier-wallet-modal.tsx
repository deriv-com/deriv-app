import React from 'react';
import { Modal } from '@deriv/components';
import CashierWalletModalHeader from './cashier-wallet-modal-header';
import CashierWalletModalBody from './cashier-wallet-modal-body';
import { observer, useStore } from '@deriv/stores';

const CashierWalletModal = observer(() => {
    const store = useStore();
    const {
        client: { balance, currency, landing_company_shortcode },
        ui: { is_dark_mode_on, is_cashier_wallet_modal_visible, is_mobile, setIsCashierWalletModalVisible },
        traders_hub: { is_demo },
    } = store;

    // TODO: Temporary wallet type. Will be refactored later. Add correct type
    const wallet_type = is_demo ? 'demo' : 'real';

    const tab_content_ref = React.useRef<HTMLDivElement>(null);
    const [active_tab_index, setActiveTabIndex] = React.useState<number>(0);
    const [is_wallet_name_visible, setIsWalletNameVisible] = React.useState<boolean>(true);

    const closeModal = () => {
        setIsCashierWalletModalVisible(false);
        setActiveTabIndex(0);
    };

    React.useEffect(() => {
        const el_tab_content = tab_content_ref.current;

        const handleScroll = (e: Event) => {
            const target = e.target as HTMLDivElement;
            setIsWalletNameVisible(!(target.scrollTop > 0));
        };

        if (is_mobile) {
            el_tab_content?.addEventListener('scroll', handleScroll);
            setIsWalletNameVisible(true);
        }

        return () => {
            el_tab_content?.removeEventListener('scroll', handleScroll);
        };
    }, [active_tab_index, is_cashier_wallet_modal_visible, is_mobile]);

    return (
        <Modal is_open={is_cashier_wallet_modal_visible} className='cashier-wallet-modal' portalId='app_contents'>
            <CashierWalletModalHeader
                balance={balance}
                closeModal={closeModal}
                currency={currency}
                is_dark={is_dark_mode_on}
                is_demo={is_demo}
                is_mobile={is_mobile}
                landing_company_shortcode={landing_company_shortcode}
                is_wallet_name_visible={is_wallet_name_visible}
            />
            <CashierWalletModalBody
                active_tab_index={active_tab_index}
                is_dark={is_dark_mode_on}
                is_demo={is_demo}
                ref={tab_content_ref}
                setActiveTabIndex={setActiveTabIndex}
                is_wallet_name_visible={is_wallet_name_visible}
                wallet_type={wallet_type}
            />
        </Modal>
    );
});

export default CashierWalletModal;
