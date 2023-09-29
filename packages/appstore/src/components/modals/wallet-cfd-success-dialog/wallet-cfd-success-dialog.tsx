import React from 'react';
import {
    Button,
    Modal,
    Text,
    WalletCard,
    DesktopWrapper,
    MobileDialog,
    MobileWrapper,
    AppLinkedWithWalletIcon,
    WalletWithAccountCard,
} from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import { formatMoney } from '@deriv/shared';
import { getAccountName } from 'Constants/utils';
import { useActiveWalletAccount } from '@deriv/hooks';
import './wallet-cfd-success-dialog.scss';
import { WalletModal } from '@deriv/wallets/src/components/WalletModal';

const WalletCFDSuccessDialog = observer(() => {
    const { ui, traders_hub } = useStore();
    const { setWalletModalActiveTab, setWalletModalActiveWalletID } = traders_hub;
    const {
        is_wallet_creation_success_modal_open,
        toggleIsWalletCreationSuccessModalOpen,
        setIsWalletModalVisible,
        is_mobile,
    } = ui;
    const active_wallet = useActiveWalletAccount();

    const wallet_details = {
        currency: active_wallet?.currency_config?.display_code,
        icon: active_wallet?.icon,
        icon_type: active_wallet?.currency_config?.type,
        name: getAccountName({
            account_type: 'wallet',
            display_currency_code: active_wallet?.currency_config?.display_code,
        }),
        balance: formatMoney(active_wallet?.currency, active_wallet?.balance, true),
        jurisdiction_title: active_wallet?.landing_company_name,
        gradient_class: active_wallet?.gradient_card_class,
    };

    // <AppLinkedWithWalletIcon
    //     app_icon={account?.icon}
    //     gradient_class={account?.gradient_class ?? ''}
    //     size={icon_size as React.ComponentProps<typeof AppLinkedWithWalletIcon>['size']}
    //     type={account?.type}
    //     wallet_icon={account?.active_wallet_icon}
    // />;

    const ModalContent = () => (
        <React.Fragment>
            <div className='wallet-cfd-success-dialog__icon'>
                <WalletCard wallet={wallet_details} size={is_mobile ? 'large' : 'medium'} />
                <AppLinkedWithWalletIcon
                    app_icon={active_wallet?.icon}
                    gradient_class={active_wallet?.gradient_card_class ?? ''}
                    // size={icon_size as React.ComponentProps<typeof AppLinkedWithWalletIcon>['size']}
                    type='fiat'
                    wallet_icon={active_wallet?.icon}
                />
            </div>
            <Text as='h2' size={is_mobile ? 'xs' : 's'} weight='bold' className='wallet-cfd-success-dialog__title'>
                <Localize
                    i18n_default_text='Your {{currency}} Wallet is ready'
                    values={{ currency: active_wallet?.currency_config?.display_code }}
                />
            </Text>
            <Text
                as='p'
                size={is_mobile ? 'xxs' : 'xs'}
                line_height='s'
                align='center'
                className='wallet-cfd-success-dialog__description'
            >
                {localize('Make a deposit into your new Wallet.')}
            </Text>
        </React.Fragment>
    );

    const ModalFooter = () => (
        <Button.Group>
            <Button secondary onClick={() => toggleIsWalletCreationSuccessModalOpen(false)}>
                {localize('Maybe later')}
            </Button>
            <Button
                primary
                onClick={() => {
                    toggleIsWalletCreationSuccessModalOpen(false);
                    setWalletModalActiveTab('Deposit');
                    setIsWalletModalVisible(true);
                    setWalletModalActiveWalletID(active_wallet?.loginid);
                }}
            >
                {localize('Deposit')}
            </Button>
        </Button.Group>
    );

    const title = 'TEST';

    const TestModal = React.useCallback(
        () => (
            <div className='wallets-cfd-success-dialog'>
                <WalletCard wallet={wallet_details} size={is_mobile ? 'large' : 'medium'} />
                <AppLinkedWithWalletIcon
                    app_icon={active_wallet?.icon}
                    gradient_class={active_wallet?.gradient_card_class ?? ''}
                    // size={icon_size as React.ComponentProps<typeof AppLinkedWithWalletIcon>['size']}
                    type='fiat'
                    wallet_icon={active_wallet?.icon}
                />
                <WalletWithAccountCard
                    wallet={wallet_details}
                    // size?: 'small' | 'medium' | 'large';
                    // state?: 'active' | 'add' | 'added' | 'default' | 'disabled' | 'faded';
                    app_icon={'IcWalletOptionsDark'}
                />

                <div className='wallets-cfd-success-dialog-title'>Create a {title} password</div>
                <span className='wallets-cfd-success-dialog-subtitle'>
                    You can use this password for all your {title} accounts.
                </span>
                <div className='wallets-cfd-success-dialog-input'>
                    <input placeholder={`${title} password`} type='password' />
                </div>
                <button className='wallets-cfd-success-dialog-button'>Create {title} password</button>
            </div>
        ),
        []
    );

    return (
        <WalletModal hideCloseButton>
            <TestModal />
            {/* <ModalContent /> */}
            {/* <ModalFooter /> */}
        </WalletModal>
    );

    return (
        <React.Fragment>
            <DesktopWrapper>
                <WalletModal>
                    {/* <Modal
                        className='wallet-success-dialog'
                        is_open={is_wallet_creation_success_modal_open}
                        toggleModal={toggleIsWalletCreationSuccessModalOpen}
                        has_close_icon={false}
                        small
                        shouldCloseOnEscape={false}
                    > */}
                    <Modal.Body>
                        <ModalContent />
                    </Modal.Body>
                    <Modal.Footer className='wallet-success-dialog__footer'>
                        <ModalFooter />
                    </Modal.Footer>
                    {/* </Modal> */}
                </WalletModal>
            </DesktopWrapper>
            <MobileWrapper>
                <MobileDialog
                    portal_element_id='deriv_app'
                    visible={is_wallet_creation_success_modal_open}
                    onClose={() => toggleIsWalletCreationSuccessModalOpen(false)}
                    has_full_height
                >
                    <div className='wallet-success-dialog__content'>
                        <ModalContent />
                        <div className='wallet-success-dialog__footer'>
                            <ModalFooter />
                        </div>
                    </div>
                </MobileDialog>
            </MobileWrapper>
        </React.Fragment>
    );
});

export default WalletCFDSuccessDialog;

// import React from 'react';
// import { Button, Modal, Text, WalletCard, DesktopWrapper, MobileDialog, MobileWrapper } from '@deriv/components';
// import { localize, Localize } from '@deriv/translations';
// import { useActiveWallet } from '@deriv/hooks';
// import { observer, useStore } from '@deriv/stores';
// import { formatMoney } from '@deriv/shared';
// import { getAccountName } from 'Constants/utils';
// import './wallet-cfd-success-dialog.scss';

// const WalletCFDSuccessDialog = observer(() => {
//     const { ui, traders_hub } = useStore();
//     const { setWalletModalActiveTab, setWalletModalActiveWalletID } = traders_hub;
//     const {
//         is_wallet_creation_success_modal_open,
//         toggleIsWalletCreationSuccessModalOpen,
//         setIsWalletModalVisible,
//         is_mobile,
//     } = ui;
//     const active_wallet = useActiveWallet();

//     const wallet_details = {
//         currency: active_wallet?.currency_config?.display_code,
//         icon: active_wallet?.icon,
//         icon_type: active_wallet?.currency_config?.type,
//         name: getAccountName({
//             account_type: 'wallet',
//             display_currency_code: active_wallet?.currency_config?.display_code,
//         }),
//         balance: formatMoney(active_wallet?.currency, active_wallet?.balance, true),
//         jurisdiction_title: active_wallet?.landing_company_name,
//         gradient_class: active_wallet?.gradient_card_class,
//     };

//     const ModalContent = () => (
//         <React.Fragment>
//             <div className='wallet-success-dialog__icon'>
//                 <WalletCard wallet={wallet_details} size={is_mobile ? 'large' : 'medium'} />
//             </div>
//             <Text as='h2' size={is_mobile ? 'xs' : 's'} weight='bold' className='wallet-success-dialog__title'>
//                 <Localize
//                     i18n_default_text='Your {{currency}} Wallet is ready'
//                     values={{ currency: active_wallet?.currency_config?.display_code }}
//                 />
//             </Text>
//             <Text
//                 as='p'
//                 size={is_mobile ? 'xxs' : 'xs'}
//                 line_height='s'
//                 align='center'
//                 className='wallet-success-dialog__description'
//             >
//                 {localize('Make a deposit into your new Wallet.')}
//             </Text>
//         </React.Fragment>
//     );

//     const ModalFooter = () => (
//         <Button.Group>
//             <Button secondary onClick={() => toggleIsWalletCreationSuccessModalOpen(false)}>
//                 {localize('Maybe later')}
//             </Button>
//             <Button
//                 primary
//                 onClick={() => {
//                     toggleIsWalletCreationSuccessModalOpen(false);
//                     setWalletModalActiveTab('Deposit');
//                     setIsWalletModalVisible(true);
//                     setWalletModalActiveWalletID(active_wallet?.loginid);
//                 }}
//             >
//                 {localize('Deposit')}
//             </Button>
//         </Button.Group>
//     );

//     return (
//         <React.Fragment>
//             <DesktopWrapper>
//                 <Modal
//                     className='wallet-success-dialog'
//                     is_open={is_wallet_creation_success_modal_open}
//                     toggleModal={toggleIsWalletCreationSuccessModalOpen}
//                     has_close_icon={false}
//                     small
//                     shouldCloseOnEscape={false}
//                 >
//                     <Modal.Body>
//                         <ModalContent />
//                     </Modal.Body>
//                     <Modal.Footer className='wallet-success-dialog__footer'>
//                         <ModalFooter />
//                     </Modal.Footer>
//                 </Modal>
//             </DesktopWrapper>
//             <MobileWrapper>
//                 <MobileDialog
//                     portal_element_id='deriv_app'
//                     visible={is_wallet_creation_success_modal_open}
//                     onClose={() => toggleIsWalletCreationSuccessModalOpen(false)}
//                     has_full_height
//                 >
//                     <div className='wallet-success-dialog__content'>
//                         <ModalContent />
//                         <div className='wallet-success-dialog__footer'>
//                             <ModalFooter />
//                         </div>
//                     </div>
//                 </MobileDialog>
//             </MobileWrapper>
//         </React.Fragment>
//     );
// });

// export default WalletCFDSuccessDialog;
