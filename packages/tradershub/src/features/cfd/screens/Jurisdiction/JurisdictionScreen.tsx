import React, { Dispatch, useEffect, useMemo } from 'react';
import { useAvailableMT5Accounts, useMT5AccountsList } from '@deriv/api';
import { Provider } from '@deriv/library';
import { qtMerge, Text } from '@deriv/quill-design';
import { THooks } from '../../../../types';
import { useDynamicLeverageModalState } from '../../components/DynamicLeverageContext';
import { Jurisdiction } from '../../constants';
import { JurisdictionCard } from './JurisdictionCard';
import { JurisdictionTncSection } from './JurisdictionTncSection';

type TJurisdictionScreenProps = {
    isCheckBoxChecked: boolean;
    selectedJurisdiction: THooks.AvailableMT5Accounts['shortcode'];
    setIsCheckBoxChecked: Dispatch<React.SetStateAction<boolean>>;
    setSelectedJurisdiction: Dispatch<React.SetStateAction<string>>;
};

const JurisdictionScreen = ({
    isCheckBoxChecked,
    selectedJurisdiction,
    setIsCheckBoxChecked,
    setSelectedJurisdiction,
}: TJurisdictionScreenProps) => {
    const { getCFDState } = Provider.useCFDContext();
    const { data, isLoading } = useAvailableMT5Accounts();
    const { data: mt5AccountsList } = useMT5AccountsList();
    const marketType = getCFDState('marketType');
    const { isDynamicLeverageVisible } = useDynamicLeverageModalState();
    const jurisdictions = useMemo(
        () => data?.filter(account => account.market_type === marketType).map(account => account.shortcode) || [],
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

    if (isLoading) return <Text>Loading...</Text>;

    return (
        <div
            className={qtMerge(
                'flex flex-col h-auto w-[85vw] items-center justify-center my-auto mx-1500 h-[75vh] transition-all ease-in duration-[0.6s]',
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
