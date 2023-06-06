import React from 'react';
import classNames from 'classnames';
import { DesktopWrapper, MobileDialog, MobileWrapper, Modal } from '@deriv/components';
import WalletModalHeader from './wallet-modal-header';
import WalletModalBody from './wallet-modal-body';
import { observer, useStore } from '@deriv/stores';

const WalletModal = observer(() => {
    const store = useStore();
    const {
        client: { balance, currency, landing_company_shortcode: shortcode },
        ui: { is_dark_mode_on, is_wallet_modal_visible, is_mobile, setIsWalletModalVisible },
        traders_hub: { is_demo },
    } = store;

    // TODO: Temporary wallet type. Will be refactored later. Add correct type
    const wallet_type = is_demo ? 'demo' : 'real';

    const [active_tab_index, setActiveTabIndex] = React.useState<number>(0);
    const [is_wallet_name_visible, setIsWalletNameVisible] = React.useState<boolean>(true);
    const [is_scrollable, setIsScrollable] = React.useState<boolean>(true);

    React.useEffect(() => {
        const el_mobile_dialog = document.getElementById('wallet_mobile_dialog');
        if (el_mobile_dialog) {
            if (!is_scrollable) {
                el_mobile_dialog.style.overflow = 'hidden';
            } else {
                el_mobile_dialog.style.overflowX = 'hidden';
                el_mobile_dialog.style.overflowY = 'scroll';
            }
        }
    }, [is_scrollable]);

    React.useEffect(() => {
        return setIsWalletNameVisible(true);
    }, [active_tab_index]);

    React.useEffect(() => {
        setIsWalletNameVisible(true);
    }, [active_tab_index]);

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
                is_mobile={is_mobile}
                is_wallet_name_visible={is_wallet_name_visible}
                setActiveTabIndex={setActiveTabIndex}
                setIsScrollable={setIsScrollable}
                setIsWalletNameVisible={setIsWalletNameVisible}
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
                    has_content_scroll={false}
                    has_full_height
                    id='wallet_mobile_dialog'
                    onScrollHandler={contentScrollHandler}
                    portal_element_id='deriv_app'
                    visible={is_wallet_modal_visible}
                    wrapper_classname={classNames('wallet-mobile-dialog__wrapper', {
                        'scrolled-content': !is_wallet_name_visible,
                    })}
                >
                    {body}
                </MobileDialog>
            </MobileWrapper>
        </>
    );
});

export default WalletModal;
