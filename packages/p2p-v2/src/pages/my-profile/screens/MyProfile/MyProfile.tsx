import React from 'react';
import { Tabs, TabList, TabPanels, TabPanel } from '../../../../components/Tabs';
import { MyProfileContent } from '../MyProfileContent';
import './MyProfile.scss';
import { MyProfileAdDetails } from '../MyProfileAdDetails';
import { MyProfileStats } from '../MyProfileStats';
import { PaymentMethods } from '../PaymentMethods';

const MyProfile = () => {
    return (
        <div className='p2p-v2-my-profile'>
            <MyProfileContent />
            <Tabs>
                <TabList list={['Stats', 'Ad Details', 'Payment Methods']} />
                <TabPanels>
                    <TabPanel>
                        <MyProfileStats />
                    </TabPanel>
                    <TabPanel>
                        <MyProfileAdDetails />
                    </TabPanel>
                    <TabPanel className='p2p-v2-my-profile__payment-methods'>
                        <PaymentMethods />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </div>
    );
};

export default MyProfile;
