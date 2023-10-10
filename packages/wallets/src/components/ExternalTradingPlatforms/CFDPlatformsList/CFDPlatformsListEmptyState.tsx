import React from 'react';
import { useHistory } from 'react-router-dom';
import './CFDPlatformsList.scss';

type TProps = {
    cryptoCurrency?: string;
    fiatCurrency?: string;
};

const CFDPlatformsListEmptyState: React.FC<TProps> = ({ cryptoCurrency, fiatCurrency }) => {
    const history = useHistory();

    return (
        <div className='wallets-cfd-list__cfd-empty-state'>
            <p className='wallets-cfd-list__cfd-empty-state__description'>
                To trade CFDs, you’ll need to use your {fiatCurrency} Wallet. Click Transfer to move your{' '}
                {cryptoCurrency} to your {fiatCurrency} Wallet.
            </p>
            <button
                className='wallets-cfd-list__cfd-empty-state__transfer-button'
                onClick={() => history.push('/appstore/traders-hub/cashier/transfer')}
            >
                Transfer
            </button>
        </div>
    );
};

export default CFDPlatformsListEmptyState;
