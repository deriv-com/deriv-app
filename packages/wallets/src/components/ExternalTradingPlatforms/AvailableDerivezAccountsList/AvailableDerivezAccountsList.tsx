import React from 'react';
import DerivEZ from '../../../public/images/derivez.svg';
import { WalletButton, WalletText } from '../../Base';
import { TradingAccountCard } from '../../TradingAccountCard';
import './AvailableDerivezAccountsList.scss';

const AvailableDerivezAccountsList: React.FC = () => {
    return (
        <TradingAccountCard
            leading={() => (
                <div className='wallets-available-derivez__icon'>
                    <DerivEZ />
                </div>
            )}
            trailing={() => (
                <WalletButton color='primary-light'>
                    <WalletText align='center' color='error' size='sm' weight='bold'>
                        Get
                    </WalletText>
                </WalletButton>
            )}
        >
            <div className='wallets-available-derivez__details'>
                <p className='wallets-available-derivez__details-title'>Deriv EZ</p>
                <p className='wallets-available-derivez__details-description'>
                    This account offers CFDs on an easy-to-get-started CFD trading platform.
                </p>
            </div>
        </TradingAccountCard>
    );
};

export default AvailableDerivezAccountsList;
