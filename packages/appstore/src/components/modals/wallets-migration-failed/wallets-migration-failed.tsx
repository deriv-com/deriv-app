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
        window.LC_API.open_chat_window();
        toggleWalletsMigrationFailedPopup(false);
    };

    const validateClickOutside = (e: MouseEvent) => {
        return is_wallet_migration_failed && !wallets_migration_failed_ref?.current?.contains(e.target as Node);
    };

    useOnClickOutside(wallets_migration_failed_ref, handleClose, validateClickOutside);

    return (
        <React.Fragment>
            {is_wallet_migration_failed && (
                <React.Fragment>
                    <DesktopWrapper>
                        <Modal
                            is_open={is_wallet_migration_failed}
                            toggleModal={handleClose}
                            width='44rem'
                            should_header_stick_body={false}
                            has_close_icon={false}
                        >
                            <div ref={wallets_migration_failed_ref}>
                                <Modal.Body>
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
                                </Modal.Body>
                                <Modal.Footer className='wallets-migration-failed__footer'>
                                    <Button secondary large onClick={handLiveChatButtonClick}>
                                        {localize('Go to live chat')}
                                    </Button>
                                    <Button primary large onClick={handleClose}>
                                        {localize('Back to Trader’s Hub')}
                                    </Button>
                                </Modal.Footer>
                            </div>
                        </Modal>
                    </DesktopWrapper>
                    <MobileWrapper>
                        <Modal
                            is_open={is_wallet_migration_failed}
                            toggleModal={handleClose}
                            width='32.3rem'
                            should_header_stick_body={false}
                            has_close_icon={false}
                        >
                            <div ref={wallets_migration_failed_ref}>
                                <Modal.Body className='wallets-migration-failed--mobile'>
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
                            </div>
                        </Modal>
                    </MobileWrapper>
                </React.Fragment>
            )}
        </React.Fragment>
    );
});

export default WalletsMigrationFailed;
