import React, { Dispatch, SetStateAction, useEffect, useMemo } from 'react';
import { clsx } from 'clsx';
import { useDynamicLeverageModalState } from '@cfd/components';
import { Jurisdiction } from '@cfd/constants';
import { useAvailableMT5Accounts, useMT5AccountsList } from '@deriv/api';
import { Provider } from '@deriv/library';
import { THooks } from '../../../../types';
import { JurisdictionCard } from './JurisdictionCard';
import { JurisdictionTncSection } from './JurisdictionTncSection';

type TJurisdictionScreenProps = {
    isCheckBoxChecked: boolean;
    selectedJurisdiction: THooks.AvailableMT5Accounts['shortcode'];
    setIsCheckBoxChecked: Dispatch<SetStateAction<boolean>>;
    setSelectedJurisdiction: Dispatch<SetStateAction<string>>;
};

const JurisdictionScreen = ({
    isCheckBoxChecked,
    selectedJurisdiction,
    setIsCheckBoxChecked,
    setSelectedJurisdiction,
}: TJurisdictionScreenProps) => {
    const { getCFDState } = Provider.useCFDContext();
    const { data: availableMT5Accounts } = useAvailableMT5Accounts();
    const { data: mt5AccountsList } = useMT5AccountsList();
    const marketType = getCFDState('marketType');
    const { isDynamicLeverageVisible } = useDynamicLeverageModalState();
    const jurisdictions = useMemo(
        () =>
            availableMT5Accounts
                ?.filter(account => account.market_type === marketType)
                .map(account => account.shortcode) ?? [],
        [availableMT5Accounts, marketType]
    );
    const addedJurisdictions = useMemo(
        () =>
            mt5AccountsList
                ?.filter(account => account.market_type === marketType && !account.is_virtual)
                .map(account => account.landing_company_short) ?? [],
        [marketType, mt5AccountsList]
    );

    useEffect(() => {
        setIsCheckBoxChecked(false);
    }, [selectedJurisdiction, setIsCheckBoxChecked]);

    return (
        <div
            className={clsx(
                'flex flex-col h-auto w-[85vw] items-center justify-center my-auto mx-30 sm:h-[75vh] transition-all ease-in duration-[0.6s]',
                isDynamicLeverageVisible &&
                    '[transform:rotateY(-180deg)] h-[700px] opacity-50 bg-system-light-primary-background'
            )}
        >
            <div className='flex lg:flex-row lg:py-20 items-center gap-16 justify-center w-full h-[82%] flex-col py-0'>
                {jurisdictions.map(jurisdiction => (
                    <JurisdictionCard
                        isAdded={addedJurisdictions.includes(jurisdiction as typeof addedJurisdictions[number])}
                        isSelected={selectedJurisdiction === jurisdiction}
                        jurisdiction={jurisdiction ?? Jurisdiction.BVI}
                        key={jurisdiction}
                        onSelect={clickedJurisdiction => {
                            if (clickedJurisdiction === selectedJurisdiction) {
                                setSelectedJurisdiction('');
                            } else {
                                setSelectedJurisdiction(clickedJurisdiction);
                            }
                        }}
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
