import React from 'react';
import AddIcon from '../../../public/images/add-icon.svg';
import { useModal } from '../../ModalProvider';
import { PrimaryActionButton } from '../../PrimaryActionButton';
import { WalletModal } from '../../WalletModal';
import { WideWrapper } from '../../WideWrapper';
import { MT5AccountType } from '../MT5AccountType';
import './GetMoreMT5Accounts.scss';

const GetMoreMT5Accounts: React.FC = () => {
    const { show } = useModal();
    return (
        <div
            className='wallets-get-more-mt5-accounts'
            onClick={() =>
                show(
                    <WalletModal>
                        <WideWrapper
                            renderFooter={() => (
                                <React.Fragment>
                                    <PrimaryActionButton>
                                        <p className='wallets-get-more-mt5-accounts-text'>Next</p>
                                    </PrimaryActionButton>
                                </React.Fragment>
                            )}
                            renderHeader={() => <div>Select Deriv MT5’s account type</div>}
                        >
                            <MT5AccountType />
                        </WideWrapper>
                    </WalletModal>
                )
            }
        >
            <div className='wallets-get-more-mt5-accounts-container'>
                <div className='wallets-get-more-mt5-accounts-container-icon'>
                    <AddIcon />
                </div>
                <div className='wallets-get-more-mt5-accounts-container-details'>
                    <div className='wallets-get-more-mt5-accounts-container-details-title'>Get more</div>
                    <div className='wallets-get-more-mt5-accounts-container-details-description'>
                        Get more Deriv MT5 accounts under your preferred jurisdictions.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GetMoreMT5Accounts;
