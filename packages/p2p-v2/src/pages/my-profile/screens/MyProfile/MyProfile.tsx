import React from 'react';
import { Tab, Tabs } from '@deriv-com/ui/dist/components/Tabs';
import { useDevice, useQueryString } from '../../../../hooks';
import { MyProfileAdDetails } from '../MyProfileAdDetails';
import { MyProfileContent } from '../MyProfileContent';
import { MyProfileCounterparties } from '../MyProfileCounterparties';
import { MyProfileStats } from '../MyProfileStats';
import MyProfileMobile from './MyProfileMobile';
import './MyProfile.scss';

const TABS = ['Stats', 'Payment methods', 'Ad details', 'My counterparties'];

const MyProfile = () => {
    const { isMobile } = useDevice();
    const { queryString, setQueryString } = useQueryString();

    if (isMobile) {
        return (
            <div className='p2p-v2-my-profile'>
                <MyProfileMobile />
            </div>
        );
    }

    return (
        <div className='p2p-v2-my-profile'>
            <MyProfileContent />
            <Tabs
                activeTab={queryString.get('tab') || 'Stats'}
                onChange={index => {
                    setQueryString({
                        tab: TABS[index],
                    });
                }}
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
                    <MyProfileCounterparties />
                </Tab>
            </Tabs>
        </div>
    );
};

export default MyProfile;
