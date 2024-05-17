import React from 'react';
import { ModalWrapper, WalletButton, WalletButtonGroup, WalletsActionScreen } from '../../../../components';
import SuccessIcon from './SuccessIcon';

const CTraderAddAccountSuccessModal = () => {
    return (
        <ModalWrapper>
            <div className='wallets-reset-mt5-password'>
                <WalletsActionScreen
                    description='Congratulations, you have successfully created your real Deriv cTrader account. To start trading,transfer funds from your Deriv account into this account.'
                    icon={<SuccessIcon />}
                    renderButtons={() => (
                        <WalletButtonGroup>
                            <WalletButton size='lg' variant='outlined'>
                                Maybe later
                            </WalletButton>
                            <WalletButton size='lg' variant='contained'>
                                Transfer now
                            </WalletButton>
                        </WalletButtonGroup>
                    )}
                />
            </div>
        </ModalWrapper>
    );
};

export default CTraderAddAccountSuccessModal;
