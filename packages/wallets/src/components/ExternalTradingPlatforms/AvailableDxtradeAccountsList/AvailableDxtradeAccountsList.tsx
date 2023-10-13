import React from 'react';
import DerivX from '../../../public/images/derivx.svg';
import { WalletButton } from '../../Base';
import { DxtradeEnterPasswordModal } from '../../DxtradeEnterPasswordModal';
import { useModal } from '../../ModalProvider';
import { TradingAccountCard } from '../../TradingAccountCard';
import './AvailableDxtradeAccountsList.scss';

const AvailableDxtradeAccountsList: React.FC = () => {
    const { show } = useModal();

    return (
        <TradingAccountCard
            leading={() => (
                <div className='wallets-available-dxtrade__icon'>
                    <DerivX />
                </div>
            )}
            trailing={() => (
                <WalletButton color='primary-light' onClick={() => show(<DxtradeEnterPasswordModal />)}>
                    Get
                </WalletButton>
            )}
        >
            <div className='wallets-available-dxtrade__details'>
                <p className='wallets-available-dxtrade__details-title'>Deriv X</p>
                <p className='wallets-available-dxtrade__details-description'>
                    This account offers CFDs on a highly customisable CFD trading platform.
                </p>
            </div>
        </TradingAccountCard>
    );
};

export default AvailableDxtradeAccountsList;
