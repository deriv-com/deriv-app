import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Tab, Tabs } from '@deriv-com/ui/dist/components/Tabs';
import { useDevice } from '../../../../hooks';
import { MyProfileAdDetails } from '../MyProfileAdDetails';
import { MyProfileContent } from '../MyProfileContent';
import { MyProfileStats } from '../MyProfileStats';
import MyProfileMobile from './MyProfileMobile';
import './MyProfile.scss';

const MyProfile = () => {
    const location = useLocation();
    const { isMobile } = useDevice();

    const queryString = useMemo(() => new URLSearchParams(location.search), [location.search]);

    if (isMobile) {
        return <MyProfileMobile />;
    }

    return (
        <div className='p2p-v2-my-profile'>
            <MyProfileContent />
            <Tabs
                activeTab={queryString.get('tab') || 'Stats'}
                variant='primary'
                wrapperClassName='p2p-v2-my-profile__tabs'
            >
                <Tab title='Stats'>
                    <MyProfileStats />
                </Tab>
                <Tab title='Payment methods'>
                    {/* TODO: Place PaymentMethods component here once merged */}
                    <h1>Payment methods</h1>
                </Tab>
                <Tab title='Ad details'>
                    <MyProfileAdDetails />
                </Tab>
                <Tab title='My counterparties'>
                    {/* TODO: Place Counterparties component here once merged */}
                    <h1>My counterparties</h1>
                </Tab>
            </Tabs>
        </div>
    );
};

export default MyProfile;
