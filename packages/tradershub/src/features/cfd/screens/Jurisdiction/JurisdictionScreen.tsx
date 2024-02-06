import React, { Dispatch, SetStateAction, useEffect, useMemo } from 'react';
import { useDynamicLeverageModalState } from '@cfd/components';
import { Jurisdiction } from '@cfd/constants';
import { useAvailableMT5Accounts, useMT5AccountsList } from '@deriv/api';
import { Provider } from '@deriv/library';
import { qtMerge } from '@deriv/quill-design';
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
                .map(account => account.shortcode) || [],
        [availableMT5Accounts, marketType]
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

    return (
        <div
            className={qtMerge(
                'flex flex-col h-auto w-[85vw] items-center justify-center my-auto mx-1500 sm:h-[75vh] transition-all ease-in duration-[0.6s]',
                isDynamicLeverageVisible && '[transform:rotateY(-180deg)] h-[700px] opacity-50'
            )}
        >
            <div className='flex flex-col py-1000 items-center gap-800 justify-center w-full h-[82%] sm:flex-row sm:py-50'>
                {jurisdictions.map(jurisdiction => (
                    <JurisdictionCard
                        isAdded={addedJurisdictions.includes(jurisdiction as typeof addedJurisdictions[number])}
                        isSelected={selectedJurisdiction === jurisdiction}
                        jurisdiction={jurisdiction || Jurisdiction.BVI}
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
