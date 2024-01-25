import React from 'react';
import { Tab, Tabs } from '@deriv-com/ui/dist/components/Tabs';
import { MyProfileAdDetails } from '../MyProfileAdDetails';
import { MyProfileContent } from '../MyProfileContent';
import { MyProfileStats } from '../MyProfileStats';
import './MyProfile.scss';

const MyProfile = () => {
    return (
        <div className='p2p-v2-my-profile'>
            <MyProfileContent />
            <Tabs variant='primary' wrapperClassName='p2p-v2-my-profile__tabs'>
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
