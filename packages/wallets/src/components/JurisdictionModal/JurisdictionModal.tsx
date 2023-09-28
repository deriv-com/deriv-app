import React from 'react';
import { WalletModal } from '../WalletModal';
import { WideWrapper } from '../WideWrapper';
import './JurisdictionModal.scss';

const JurisdictionModal = () => {
    return (
        <WalletModal>
            <WideWrapper
                renderFooter={() => (
                    <React.Fragment>
                        <button className='wallets-jurisdiction-modal__button'>Next</button>
                    </React.Fragment>
                )}
                renderHeader={() => <div>Choose a jurisdiction for your MT5 Derived account</div>}
            >
                <div className='wallets-jurisdiction-modal'>BODY</div>
            </WideWrapper>
        </WalletModal>
    );
};

export default JurisdictionModal;
