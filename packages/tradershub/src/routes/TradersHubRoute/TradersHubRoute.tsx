import React from 'react';
import {
    CFDSection,
    DemoRealSwitcher,
    OptionsAndMultipliersSection,
    RegulationSwitcherDesktop,
    RegulationSwitcherMobile,
    TotalAssets,
    TradersHubContent,
} from '@/components';
import { useRegulationFlags } from '@/hooks';
import { useUIContext } from '@/providers';
import { useIsDIELEnabled } from '@deriv/api-v2';
import { Tab, Tabs, Text, useDevice } from '@deriv-com/ui';

const TradersHubRoute = () => {
    const { isDesktop } = useDevice();
    const { data: isDIEL } = useIsDIELEnabled();
    const { uiState } = useUIContext();
    const { accountType } = uiState;
    const isReal = accountType === 'real';
    const isDemo = accountType === 'demo';
    const { hasActiveDerivAccount } = useRegulationFlags();

    const isSwitcherVisible = isDIEL && isReal;
    const isTotalAssetsVisible = hasActiveDerivAccount || isDemo;

    // if (!isDesktop)
    //     return (
    //         <div className='p-16'>
    //             <div className='flex items-end justify-between pb-24'>
    //                 <div className='flex flex-col'>
    //                     <Text className='pb-4' weight='bold'>
    //                         Trader&apos;s Hub
    //                     </Text>
    //                     <DemoRealSwitcher />
    //                 </div>
    //                 {isSwitcherVisible && <RegulationSwitcherMobile />}
    //             </div>
    //             <div />
    //             <div className='grid pb-24 place-content-center'>{isTotalAssetsVisible && <TotalAssets />}</div>
    //             <Tabs className='w-full p-4 rounded-sm'>
    //                 <Tab className='px-8 py-6 rounded-xs' title='Options & Multipliers'>
    //                     <OptionsAndMultipliersSection />
    //                 </Tab>
    //                 <Tab className='px-8 py-6 rounded-xs' title='CFDs'>
    //                     <CFDSection />
    //                 </Tab>
    //             </Tabs>
    //         </div>
    //     );

    return (
        <div className='p-16 lg:space-y-24'>
            <div className=''>
                <div className='flex items-end justify-between pb-24'>
                    <div className='flex flex-col items-start gap-6 lg:flex-row'>
                        <Text className='pb-4 font-sans lg:text-3xl text-default lg:p-0' weight='bold'>
                            Trader&apos;s Hub
                        </Text>
                        <DemoRealSwitcher />
                    </div>
                    <div className='lg:d-none'> {isSwitcherVisible && <RegulationSwitcherMobile />} </div>
                </div>

                <div className='lg:block d-none'>{isSwitcherVisible && <RegulationSwitcherDesktop />}</div>
                {!isDesktop && (
                    <div className='grid pb-24 place-content-center'>{isTotalAssetsVisible && <TotalAssets />}</div>
                )}
            </div>
            <div className='lg:block d-none'>
                <TradersHubContent />
            </div>
            <div className='lg:d-none'>
                <Tabs className='w-full p-4 rounded-sm'>
                    <Tab className='px-8 py-6 rounded-xs' title='Options & Multipliers'>
                        <OptionsAndMultipliersSection />
                    </Tab>

                    <Tab className='px-8 py-6 rounded-xs' title='CFDs'>
                        <CFDSection />
                    </Tab>
                </Tabs>
            </div>
        </div>
    );
};

export default TradersHubRoute;
