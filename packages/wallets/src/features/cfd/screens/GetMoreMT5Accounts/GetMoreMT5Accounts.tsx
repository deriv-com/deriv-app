import React from 'react';
import { useModal } from '../../../../components/ModalProvider';
import AddIcon from '../../../../public/images/add-icon.svg';
import { MT5AccountTypeModal } from '../../modals';
import './GetMoreMT5Accounts.scss';

const GetMoreMT5Accounts: React.FC = () => {
    const { show } = useModal();

    return (
        <div className='wallets-get-more-mt5-accounts' onClick={() => show(<MT5AccountTypeModal />)}>
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
