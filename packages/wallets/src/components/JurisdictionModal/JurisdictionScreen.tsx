import React, { useMemo, useState } from 'react';
import { useAvailableMT5Accounts } from '@deriv/api';
import { useModal } from '../ModalProvider';
import JurisdictionCard from './JurisdictionCard';
import './JurisdictionModal.scss';

const JurisdictionScreen = () => {
    const [selectedJurisdiction, setSelectedJurisdiction] = useState('');
    const { modalState, show } = useModal();
    const { data, isLoading } = useAvailableMT5Accounts();

    const marketType = modalState?.marketType || 'all';

    const jurisdictions = useMemo(
        () =>
            data?.filter(account => account.market_type === modalState?.marketType).map(account => account.shortcode) ||
            [],
        [isLoading]
    );

    if (isLoading) return <h1>Loading...</h1>;

    return (
        <div className='wallets-jurisdiction-modal'>
            <div className='wallets-jurisdiction-modal__cards'>
                {jurisdictions.map(jurisdiction => (
                    <JurisdictionCard
                        isSelected={selectedJurisdiction === jurisdiction}
                        jurisdiction={jurisdiction || 'bvi'}
                        key={jurisdiction}
                        onSelect={clickedJurisdiction => {
                            if (clickedJurisdiction === selectedJurisdiction) {
                                setSelectedJurisdiction('');
                            } else {
                                setSelectedJurisdiction(clickedJurisdiction);
                            }
                        }}
                        tag='Straight-through processing'
                    />
                ))}
            </div>

            {selectedJurisdiction && (
                <div className='wallets-jurisdiction-modal__tnc'>
                    Add Your Deriv MT5 Financial account under Deriv (V) Ltd, regulated by the Vanuatu Financial
                    Services Commission.
                    <div className='wallets-jurisdiction-modal__tnc-checkbox'>
                        <input type='checkbox' />
                        <label>I confirm and accept Deriv (V) Ltd’s Terms and Conditions</label>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JurisdictionScreen;
