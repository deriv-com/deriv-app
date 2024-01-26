import React, { useState } from 'react';
import { MobileTabs } from '../../../../components';
import { MyProfileAdDetails } from '../MyProfileAdDetails';
import { MyProfileContent } from '../MyProfileContent';
import MyProfileStatsMobile from '../MyProfileStats/MyProfileStatsMobile';

const MyProfileMobile = () => {
    const [currentTab, setCurrentTab] = useState('');

    if (currentTab === 'Stats') {
        return <MyProfileStatsMobile onBack={() => setCurrentTab('')} />;
    }
    if (currentTab === 'Ad details') {
        return <MyProfileAdDetails onBack={() => setCurrentTab('')} />;
    }

    return (
        <>
            <MyProfileContent />
            <MobileTabs
                onChangeTab={clickedTab => setCurrentTab(clickedTab)}
                tabs={['Stats', 'Payment methods', 'Ad details', 'My counterparties']}
            />
        </>
    );
};

export default MyProfileMobile;
