import React from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslations } from '@deriv-com/translations';
import useDevice from '../../hooks/useDevice';
import { WalletButton } from '../Base';
import { useModal } from '../ModalProvider';
import './DerivAppsSuccessFooter.scss';

const DerivAppsSuccessFooter = () => {
    const { hide } = useModal();
    const { isDesktop } = useDevice();
    const history = useHistory();
    const { localize } = useTranslations();

    return (
        <div className='wallets-deriv-apps-success-footer'>
            <WalletButton isFullWidth={!isDesktop} onClick={hide} size='lg' variant='outlined'>
                {localize('Maybe later')}
            </WalletButton>
            <WalletButton
                isFullWidth={!isDesktop}
                onClick={() => {
                    history.push('/wallet/account-transfer');
                    hide();
                }}
                size='lg'
            >
                {localize('Transfer funds')}
            </WalletButton>
        </div>
    );
};

export { DerivAppsSuccessFooter };
