import React from 'react';
import DerivX from '../../../public/images/derivx.svg';
import { WalletButton, WalletText } from '../../Base';
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
                    <WalletText align='center' color='error' size='sm' weight='bold'>
                        Get
                    </WalletText>
                </WalletButton>
            )}
        >
            <div className='wallets-available-dxtrade__details'>
                <p className='wallets-available-dxtrade__details-title'>
                    <WalletText size='sm' weight='bold'>
                        Deriv X
                    </WalletText>
                </p>
                <WalletText size='xs'>
                    This account offers CFDs on a highly customisable CFD trading platform.
                </WalletText>
            </div>
        </TradingAccountCard>
    );
};

export default AvailableDxtradeAccountsList;
