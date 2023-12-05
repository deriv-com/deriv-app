import React from 'react';
import { useHistory } from 'react-router-dom';
import useDevice from '../../hooks/useDevice';
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
                Maybe later
            </WalletButton>
            <WalletButton
                isFullWidth={!isDesktop}
                onClick={() => {
                    history.push('wallets/cashier/transfer');
                    hide();
                }}
                size='lg'
            >
                Transfer funds
            </WalletButton>
        </div>
    );
};

export { DerivAppsSuccessFooter };
