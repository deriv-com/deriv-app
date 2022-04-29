import * as React from 'react';
import WalletModal from 'Components/app-wallet-modal';

const TradingHub = () => {
    return (
        <WalletModal>
        <WalletModal.Trigger>
            <div
                onClick={() => {
                 
                }}
            >
                Transfer
            </div>
        </WalletModal.Trigger>
        <WalletModal.Body message='hi' message_type='success' wallet_name='Boleto'>
           <div>
               Hello
           </div>
        </WalletModal.Body>
    </WalletModal>
    );
};

export default TradingHub;
