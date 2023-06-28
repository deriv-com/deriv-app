import React from 'react';
import { Modal } from '@deriv/components';
import WalletModalHeader from './wallet-modal-header';
import WalletModalBody from './wallet-modal-body';
import { observer, useStore } from '@deriv/stores';
import { useWalletList } from '@deriv/hooks';

const WalletModal = observer(() => {
    const { data } = useWalletList();
    const store = useStore();
    const {
        client: { balance, currency, landing_company_shortcode: shortcode },
        ui: { is_dark_mode_on, is_wallet_modal_visible, is_mobile, setIsWalletModalVisible },
        traders_hub: { is_demo },
    } = store;

    // TODO: This should be removed when we refactor how to pass data
    const current_wallet = data?.find(wallet =>
        is_demo ? wallet.account_type === 'virtual' : wallet.currency === currency
    );

    // TODO: Temporary wallet type. Will be refactored later. Add correct type
    const wallet_type = is_demo ? 'demo' : 'real';

    const [active_tab_index, setActiveTabIndex] = React.useState<number>(0);
    const [is_wallet_name_visible, setIsWalletNameVisible] = React.useState<boolean>(true);

    React.useEffect(() => {
        return setIsWalletNameVisible(true);
    }, [active_tab_index, is_wallet_modal_visible]);

    const closeModal = () => {
        setIsWalletModalVisible(false);
        setActiveTabIndex(0);
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

    return (
        <Modal is_open={is_wallet_modal_visible} className='wallet-modal' portalId='deriv_app'>
            <WalletModalHeader
                balance={balance}
                closeModal={closeModal}
                currency={currency}
                gradient_class={current_wallet?.gradient_header_class || ''}
                is_dark={is_dark_mode_on}
                is_demo={is_demo}
                is_mobile={is_mobile}
                shortcode={shortcode}
                is_wallet_name_visible={is_wallet_name_visible}
            />
            <WalletModalBody
                active_tab_index={active_tab_index}
                contentScrollHandler={contentScrollHandler}
                is_dark={is_dark_mode_on}
                is_demo={is_demo}
                is_mobile={is_mobile}
                is_wallet_name_visible={is_wallet_name_visible}
                setActiveTabIndex={setActiveTabIndex}
                setIsWalletNameVisible={setIsWalletNameVisible}
                wallet_type={wallet_type}
            />
        </Modal>
    );
});

export default WalletModal;
