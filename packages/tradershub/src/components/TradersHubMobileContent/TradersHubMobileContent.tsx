import React, { Fragment } from 'react';
import { CFDSection, OptionsAndMultipliersSection } from '@/components';
import { Tab, Tabs } from '@deriv-com/ui';

const TradersHubMobileContent = () => {
    return (
        <Fragment>
            <Tabs className='w-full p-4 rounded-sm'>
                <Tab className='px-8 py-6 rounded-xs' title='Options & Multipliers'>
                    <OptionsAndMultipliersSection />
                </Tab>

                <Tab className='px-8 py-6 rounded-xs' title='CFDs'>
                    <CFDSection />
                </Tab>
            </Tabs>
        </Fragment>
    );
};

export default TradersHubMobileContent;
