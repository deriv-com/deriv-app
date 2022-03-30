import * as React from 'react';
import MyProfileBalance from '../my-profile-balance';
import MyProfileDetailsTable from '../my-profile-details-table';
import MyProfileName from '../my-profile-name';
import { useStores } from 'Stores';
import './my-profile-details-container.scss';

const MyProfileDetailsContainer = () => {
    const { my_profile_store } = useStores();

    React.useEffect(() => {
        my_profile_store.getAdvertiserInfo();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className='my-profile-details-container'>
            <MyProfileName />
            <div className='my-profile-details-container--table'>
                <MyProfileBalance />
                <MyProfileDetailsTable />
            </div>
        </div>
    );
};

export default MyProfileDetailsContainer;
