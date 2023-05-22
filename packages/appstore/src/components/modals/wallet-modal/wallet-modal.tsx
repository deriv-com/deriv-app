import React from 'react';
import { DesktopWrapper, MobileDialog, MobileWrapper, Modal } from '@deriv/components';
import WalletModalHeader from './wallet-modal-header';
import WalletModalBody from './wallet-modal-body';
import { observer, useStore } from '@deriv/stores';
import classNames from 'classnames';

const WalletModal = observer(() => {
    const store = useStore();
    const {
        client: { balance, currency, landing_company_shortcode: shortcode },
        ui: { is_dark_mode_on, is_wallet_modal_visible, is_mobile, setIsWalletModalVisible },
        traders_hub: { is_demo },
    } = store;

    // TODO: Temporary wallet type. Will be refactored later. Add correct type
    const wallet_type = is_demo ? 'demo' : 'real';

    const mobile_dialog_ref = React.useRef<HTMLDivElement>(null);
    const [active_tab_index, setActiveTabIndex] = React.useState<number>(0);
    const [is_wallet_name_visible, setIsWalletNameVisible] = React.useState<boolean>(true);

    const closeModal = () => {
        setIsWalletModalVisible(false);
        setActiveTabIndex(0);
    };

    React.useEffect(() => {
        const el_mobile_dialog = mobile_dialog_ref.current;

        const handleScroll = (e: Event) => {
            const target = e.target as HTMLDivElement;
            const height_offset = 40;
            setIsWalletNameVisible(!(target.scrollTop > height_offset));
        };

        if (is_mobile) {
            el_mobile_dialog?.addEventListener('scroll', handleScroll);
            setIsWalletNameVisible(true);
        }

        return () => {
            el_mobile_dialog?.removeEventListener('scroll', handleScroll);
        };
    }, [active_tab_index, is_wallet_modal_visible, is_mobile]);

    const body = (
        <>
            <WalletModalHeader
                balance={balance}
                closeModal={closeModal}
                currency={currency}
                is_dark={is_dark_mode_on}
                is_demo={is_demo}
                is_mobile={is_mobile}
                shortcode={shortcode}
                is_wallet_name_visible={is_wallet_name_visible}
            />
            <WalletModalBody
                active_tab_index={active_tab_index}
                is_dark={is_dark_mode_on}
                is_demo={is_demo}
                is_wallet_name_visible={is_wallet_name_visible}
                setActiveTabIndex={setActiveTabIndex}
                wallet_type={wallet_type}
            />
        </>
    );

    return (
        <>
            <DesktopWrapper>
                <Modal is_open={is_wallet_modal_visible} className='wallet-modal' portalId='deriv_app'>
                    {body}
                </Modal>
            </DesktopWrapper>
            <MobileWrapper>
                <MobileDialog
                    className='wallet-mobile-dialog'
                    wrapper_classname={classNames('wallet-mobile-dialog__wrapper', {
                        'scrolled-content': !is_wallet_name_visible,
                    })}
                    portal_element_id='deriv_app'
                    visible={is_wallet_modal_visible}
                    has_content_scroll={false}
                    ref={mobile_dialog_ref}
                >
                    {body}
                </MobileDialog>
            </MobileWrapper>
        </>
    );
});

export default WalletModal;
