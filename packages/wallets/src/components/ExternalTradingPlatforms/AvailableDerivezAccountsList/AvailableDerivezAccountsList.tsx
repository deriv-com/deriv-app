import React from 'react';
import DerivEZ from '../../../public/images/derivez.svg';
import { SecondaryActionButton } from '../../SecondaryActionButton';
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
                <SecondaryActionButton>
                    <p className='wallets-available-derivez__text'>Get</p>
                </SecondaryActionButton>
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
