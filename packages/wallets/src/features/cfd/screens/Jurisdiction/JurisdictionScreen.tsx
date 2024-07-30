import React, { FC, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import { useDebounceValue } from 'usehooks-ts';
import { useAvailableMT5Accounts, useMT5AccountsList } from '@deriv/api-v2';
import { WalletText } from '../../../../components/Base/WalletText';
import { useModal } from '../../../../components/ModalProvider';
import { THooks } from '../../../../types';
import { useDynamicLeverageModalState } from '../../components/DynamicLeverageContext';
import { MarketTypeDetails } from '../../constants';
import { JurisdictionCard } from './JurisdictionCard';
import { JurisdictionTncSection } from './JurisdictionTncSection';
import './JurisdictionScreen.scss';

type TJurisdictionScreenProps = {
    isCheckBoxChecked: boolean;
    selectedJurisdiction: THooks.AvailableMT5Accounts['shortcode'];
    setIsCheckBoxChecked: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedJurisdiction: React.Dispatch<React.SetStateAction<string>>;
};

const JurisdictionScreen: FC<TJurisdictionScreenProps> = ({
    isCheckBoxChecked,
    selectedJurisdiction,
    setIsCheckBoxChecked,
    setSelectedJurisdiction,
}) => {
    const { getModalState } = useModal();
    const { data, isLoading } = useAvailableMT5Accounts();
    const { data: mt5AccountsList } = useMT5AccountsList();
    const marketType = getModalState('marketType') as keyof typeof MarketTypeDetails;
    const { isDynamicLeverageVisible } = useDynamicLeverageModalState();
    const [isJurisdictionScreenHidden] = useDebounceValue(isDynamicLeverageVisible, 600);
    const jurisdictions = useMemo(
        () =>
            data
                ?.filter(account => account.market_type === marketType && account.product !== 'zero_spread')
                .map(account => account.shortcode) || [],
        [data, marketType]
    );
    const addedJurisdictions = useMemo(
        () =>
            mt5AccountsList
                ?.filter(account => account.market_type === marketType)
                .map(account => account.landing_company_short) || [],
        [marketType, mt5AccountsList]
    );

    useEffect(() => {
        setIsCheckBoxChecked(false);
    }, [selectedJurisdiction, setIsCheckBoxChecked]);

    if (isLoading) return <WalletText>Loading...</WalletText>;

    return (
        <div
            className={classNames('wallets-jurisdiction-screen', {
                'wallets-jurisdiction-screen--flip': isDynamicLeverageVisible,
                'wallets-jurisdiction-screen--hidden': isDynamicLeverageVisible && isJurisdictionScreenHidden,
            })}
        >
            <div className='wallets-jurisdiction-screen__cards'>
                {jurisdictions.map(jurisdiction => (
                    <JurisdictionCard
                        isAdded={addedJurisdictions.includes(jurisdiction as typeof addedJurisdictions[number])}
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
            <JurisdictionTncSection
                isCheckBoxChecked={isCheckBoxChecked}
                selectedJurisdiction={selectedJurisdiction}
                setIsCheckBoxChecked={setIsCheckBoxChecked}
            />
        </div>
    );
};

export default JurisdictionScreen;
