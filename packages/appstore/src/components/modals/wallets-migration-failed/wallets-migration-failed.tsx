import React from 'react';
import { DesktopWrapper, Text, MobileWrapper, useOnClickOutside, Modal, Button } from '@deriv/components';
import { localize } from '@deriv/translations';
import { useStore, observer } from '@deriv/stores';
import './wallets-migration-failed.scss';

const WalletsMigrationFailed = observer(() => {
    const { traders_hub } = useStore();
    const { is_wallet_migration_failed, toggleWalletsMigrationFailedPopup } = traders_hub;

    const wallets_migration_failed_ref = React.useRef<HTMLDivElement>(null);

    const handleClose = () => {
        toggleWalletsMigrationFailedPopup(false);
    };

    const handLiveChatButtonClick = () => {
        toggleWalletsMigrationFailedPopup(false);
        window.LiveChatWidget?.call('maximize');
    };

    const validateClickOutside = (e: MouseEvent) => {
        // console.log('TRALALA');
        // return is_wallet_migration_failed && !wallets_migration_failed_ref?.current?.contains(e.target as Node);

        // anywhere outside the modal should close the modal
        if (wallets_migration_failed_ref.current && !wallets_migration_failed_ref.current.contains(e.target as Node)) {
            // console.log('Validate FALSE');
            return false;
        }
        // console.log('Validate TRUE');
        return true;
    };

    // useOnClickOutside(wallets_migration_failed_ref, handleClose, validateClickOutside);

    return (
        <React.Fragment>
            {is_wallet_migration_failed && (
                <React.Fragment>
                    <DesktopWrapper>
                        {/* <div ref={wallets_migration_failed_ref}> */}
                        <Modal
                            is_open={is_wallet_migration_failed}
                            toggleModal={handleClose}
                            // height='20rem'
                            width='44rem'
                            should_header_stick_body={false}
                            has_close_icon={false}
                        >
                            <Modal.Body>
                                <React.Fragment>
                                    <Text
                                        as='h1'
                                        size='s'
                                        color='prominent'
                                        weight='bold'
                                        className='wallets-migration-failed__title'
                                    >
                                        {localize('Sorry for the interruption')}
                                    </Text>
                                    <Text size='xs'>
                                        {localize(
                                            "We're unable to complete with the Wallet upgrade. Please try again later or contact us via live chat."
                                        )}
                                    </Text>
                                </React.Fragment>
                            </Modal.Body>
                            <Modal.Footer className='wallets-migration-failed__footer'>
                                <Button secondary large onClick={handLiveChatButtonClick}>
                                    {localize('Go to live chat')}
                                </Button>
                                <Button primary large onClick={handleClose}>
                                    {localize('Back to Trader’s Hub')}
                                </Button>
                            </Modal.Footer>
                        </Modal>
                        {/* </div> */}
                    </DesktopWrapper>
                    <MobileWrapper>
                        <Modal
                            is_open={is_wallet_migration_failed}
                            toggleModal={handleClose}
                            // height='16rem'
                            width='32.3rem'
                            should_header_stick_body={false}
                            has_close_icon={false}
                        >
                            <Modal.Body className='wallets-migration-failed--mobile'>
                                <React.Fragment>
                                    <Text
                                        as='h1'
                                        size='xs'
                                        color='prominent'
                                        weight='bold'
                                        className='wallets-migration-failed__title--mobile'
                                    >
                                        {localize('Sorry for the interruption')}
                                    </Text>
                                    <Text size='xxs'>
                                        {localize(
                                            "We're unable to complete with the Wallet upgrade. Please try again later or contact us via live chat."
                                        )}
                                    </Text>
                                </React.Fragment>
                            </Modal.Body>
                            <Modal.Footer className='wallets-migration-failed__footer--mobile'>
                                <Button secondary large onClick={handLiveChatButtonClick}>
                                    {localize('Go to live chat')}
                                </Button>
                                <Button
                                    primary
                                    large
                                    onClick={handleClose}
                                    classNameSpan='wallets-migration-failed__text--mobile'
                                >
                                    {localize('Back to Trader’s Hub')}
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </MobileWrapper>
                </React.Fragment>
            )}
        </React.Fragment>
    );
});

export default WalletsMigrationFailed;
