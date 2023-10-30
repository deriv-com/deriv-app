import React, { FC, useMemo } from 'react';
import { useAvailableMT5Accounts } from '@deriv/api';
import { WalletText } from '../../../../components/Base/WalletText';
import { useModal } from '../../../../components/ModalProvider';
import { THooks } from '../../../../types';
import { MarketTypeToTitleMapper } from '../../constants';
import { JurisdictionCard } from './JurisdictionCard';
import './JurisdictionScreen.scss';

type TJurisdictionScreenProps = {
    selectedJurisdiction: THooks.AvailableMT5Accounts['shortcode'];
    setSelectedJurisdiction: React.Dispatch<React.SetStateAction<string>>;
};

type TJurisdictionFootNoteTitle = {
    marketType: keyof typeof MarketTypeToTitleMapper;
    selectedJurisdiction: THooks.AvailableMT5Accounts['shortcode'];
};

const JurisdictionFootNoteTitle: FC<TJurisdictionFootNoteTitle> = ({ marketType, selectedJurisdiction }) => {
    let footnoteText: string | undefined;

    switch (selectedJurisdiction) {
        case 'svg':
            footnoteText = `Add your Deriv MT5 ${MarketTypeToTitleMapper[marketType]} account under Deriv (SVG) LLC (company no. 273 LLC 2020).`;
            break;
        case 'bvi':
            footnoteText = `Add your Deriv MT5 ${MarketTypeToTitleMapper[marketType]} account under Deriv (BVI) Ltd, regulated by the British Virgin Islands Financial Services Commission (License no. SIBA/L/18/1114).`;
            break;
        case 'labuan':
            footnoteText = `Add your Deriv MT5 ${MarketTypeToTitleMapper[marketType]} STP account under Deriv (FX) Ltd regulated by Labuan Financial Services Authority (License no. MB/18/0024).`;
            break;
        case 'vanuatu':
            footnoteText = `Add your Deriv MT5 ${MarketTypeToTitleMapper[marketType]} account under Deriv (V) Ltd, regulated by the Vanuatu Financial Services Commission.`;
            break;
        default:
            footnoteText = undefined;
            break;
    }

    if (!footnoteText) {
        return null;
    }

    return (
        <WalletText size='sm' weight='bold'>
            {footnoteText}
        </WalletText>
    );
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

            <div className='wallets-jurisdiction-screen__tnc'>
                {selectedJurisdiction && (
                    <JurisdictionFootNoteTitle
                        marketType={modalState?.marketType || 'all'}
                        selectedJurisdiction={selectedJurisdiction}
                    />
                )}
                {selectedJurisdiction && selectedJurisdiction !== 'svg' && (
                    <div className='wallets-jurisdiction-screen__tnc-checkbox'>
                        <input id='tnc-checkbox' type='checkbox' />
                        <label htmlFor='tnc-checkbox' style={{ cursor: 'pointer' }}>
                            <WalletText>I confirm and accept Deriv (V) Ltd&lsquo;s Terms and Conditions</WalletText>
                        </label>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JurisdictionScreen;
