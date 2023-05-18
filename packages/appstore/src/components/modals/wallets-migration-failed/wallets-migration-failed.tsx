import React from 'react';
import { DesktopWrapper, Text, MobileWrapper, useOnClickOutside, Dialog } from '@deriv/components';
import { localize } from '@deriv/translations';
import { useStore, observer } from '@deriv/stores';
import './wallets-migration-failed.scss';

const WalletsMigrationFailed = observer(() => {
    const { traders_hub, ui } = useStore();
    const { is_wallet_migration_failed, toggleWalletsMigrationFailedPopup } = traders_hub;
    const { is_mobile } = ui;

    const wallets_upgrade_ref = React.useRef<HTMLDivElement>(null);

    const handleClose = () => {
        toggleWalletsMigrationFailedPopup(false);
    };

    const validateClickOutside = (e: MouseEvent) => {
        // anywhere outside the modal should close the modal
        if (wallets_upgrade_ref.current && !wallets_upgrade_ref.current.contains(e.target as Node)) {
            return false;
        }
        return true;
    };

    useOnClickOutside(wallets_upgrade_ref, handleClose, validateClickOutside);

    const dialog = (
        <Dialog
            confirm_button_text={localize('Back to Trader’s Hub')}
            cancel_button_text={localize('Go to live chat')}
            is_closed_on_cancel
            is_closed_on_confirm
            is_visible={is_wallet_migration_failed}
            onCancel={handleClose}
            onConfirm={handleClose}
        >
            <React.Fragment>
                <Text
                    as='h1'
                    size={is_mobile ? 'xs' : 's'}
                    color='prominent'
                    weight='bold'
                    className='wallets-migration-failed__title'
                >
                    {localize('Sorry for the interruption')}
                </Text>
                <Text size={is_mobile ? 'xxs' : 'xs'}>
                    {localize(
                        "We're unable to complete with the Wallet upgrade. Please try again later or contact us via live chat."
                    )}
                </Text>
            </React.Fragment>
        </Dialog>
    );

    return (
        <React.Fragment>
            {is_wallet_migration_failed && (
                <React.Fragment>
                    <DesktopWrapper>{dialog}</DesktopWrapper>
                    <MobileWrapper>{dialog}</MobileWrapper>
                </React.Fragment>
            )}
        </React.Fragment>
    );
});

export default WalletsMigrationFailed;
