import React from 'react';
import { MobileTabs, ProfileContent } from '@/components';
import { useQueryString } from '@/hooks';
import { MyProfileAdDetails } from '../MyProfileAdDetails';
import { MyProfileCounterparties } from '../MyProfileCounterparties';
import MyProfileStatsMobile from '../MyProfileStats/MyProfileStatsMobile';
import { PaymentMethods } from '../PaymentMethods';

const MyProfileMobile = () => {
    const { queryString, setQueryString } = useQueryString();
    const currentTab = queryString.tab;

    if (currentTab === 'Stats') {
        return <MyProfileStatsMobile />;
    }
    if (currentTab === 'Ad details') {
        return <MyProfileAdDetails />;
    }
    if (currentTab === 'My counterparties') {
        return <MyProfileCounterparties />;
    }
    if (currentTab === 'Payment methods') {
        return <PaymentMethods />;
    }

    return (
        <>
            <ProfileContent />
            <MobileTabs
                onChangeTab={clickedTab =>
                    setQueryString({
                        tab: clickedTab,
                    })
                }
                tabs={['Stats', 'Payment methods', 'Ad details', 'My counterparties']}
            />
        </>
    );
};

export default MyProfileMobile;
