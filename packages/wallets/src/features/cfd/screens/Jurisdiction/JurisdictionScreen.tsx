import React, { FC, useMemo } from 'react';
import { useAvailableMT5Accounts } from '@deriv/api';
import { WalletText } from '../../../../components/Base/WalletText';
import { useModal } from '../../../../components/ModalProvider';
import { JurisdictionCard } from './JurisdictionCard';
import './JurisdictionScreen.scss';
import { THooks } from '../../types';

type TJurisdictionScreenProps = {
    selectedJurisdiction: THooks.AvailableMT5Accounts['shortcode'];
    setSelectedJurisdiction: React.Dispatch<React.SetStateAction<string>>;
};

const JurisdictionScreen: FC<TJurisdictionScreenProps> = ({ selectedJurisdiction, setSelectedJurisdiction }) => {
    const { modalState } = useModal();
    const { data, isLoading } = useAvailableMT5Accounts();
    const jurisdictions = useMemo(
        () =>
            data?.filter(account => account.market_type === modalState?.marketType).map(account => account.shortcode) ||
            [],
        [data, modalState?.marketType]
    );

    if (isLoading) return <WalletText>Loading...</WalletText>;

    return (
        <div className='wallets-jurisdiction-screen'>
            <div className='wallets-jurisdiction-screen__cards'>
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

            {selectedJurisdiction && selectedJurisdiction !== 'svg' && (
                <div className='wallets-jurisdiction-screen__tnc'>
                    Add Your Deriv MT5 Financial account under Deriv (V) Ltd, regulated by the Vanuatu Financial
                    Services Commission.
                    <div className='wallets-jurisdiction-screen__tnc-checkbox'>
                        <input id='tnc-checkbox' type='checkbox' />
                        <label htmlFor='tnc-checkbox' style={{ cursor: 'pointer' }}>
                            <WalletText>I confirm and accept Deriv (V) Ltd&lsquo;s Terms and Conditions</WalletText>
                        </label>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JurisdictionScreen;
