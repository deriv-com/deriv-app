import React from 'react';
import { useHistory } from 'react-router-dom';
import { Localize } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
import { WalletButton } from '../Base';
import { useModal } from '../ModalProvider';
import './DerivAppsSuccessFooter.scss';

const DerivAppsSuccessFooter = () => {
    const { hide } = useModal();
    const { isDesktop } = useDevice();
    const history = useHistory();

    return (
        <div className='wallets-deriv-apps-success-footer'>
            <WalletButton isFullWidth={!isDesktop} onClick={hide} size='lg' variant='outlined'>
                <Localize i18n_default_text='Maybe later' />
            </WalletButton>
            <WalletButton
                isFullWidth={!isDesktop}
                onClick={() => {
                    history.push('/wallet/account-transfer');
                    hide();
                }}
                size='lg'
            >
                <Localize i18n_default_text='Transfer funds' />
            </WalletButton>
        </div>
    );
};

export { DerivAppsSuccessFooter };
