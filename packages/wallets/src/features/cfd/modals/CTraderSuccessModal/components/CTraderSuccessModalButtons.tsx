import React from 'react';
import { useHistory } from 'react-router-dom';
import { WalletButton, WalletButtonGroup } from '../../../../../components';

type TCTraderSuccessModalButtons = {
    hide: () => void;
    isDemo: boolean;
};

const CTraderSuccessModalButtons = ({ hide, isDemo }: TCTraderSuccessModalButtons) => {
    const history = useHistory();

    if (isDemo) {
        return (
            <div className='wallets-success-btn'>
                <WalletButton isFullWidth onClick={hide} size='lg'>
                    OK
                </WalletButton>
            </div>
        );
    }

    return (
        <WalletButtonGroup isFlex isFullWidth>
            <WalletButton onClick={hide} size='lg' variant='outlined'>
                Maybe later
            </WalletButton>
            <WalletButton
                onClick={() => {
                    hide();
                    history.push('/appstore/traders-hub/cashier/account-transfer');
                }}
                size='lg'
            >
                Transfer funds
            </WalletButton>
        </WalletButtonGroup>
    );
};

export default CTraderSuccessModalButtons;
