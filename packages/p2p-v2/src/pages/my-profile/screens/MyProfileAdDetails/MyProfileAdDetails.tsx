import React from 'react';
import { useAdvertiserInfo, useAdvertiserUpdate } from '@deriv/api';
import MyProfileAdDetailsTextarea from './MyProfileAdDetailsTextarea';
import './MyProfileAdDetails.scss';

const MyProfileAdDetails = () => {
    const { data: advertiserInfo, isLoading } = useAdvertiserInfo();
    const { mutate: updateAdvertiser } = useAdvertiserUpdate();

    console.log(advertiserInfo);

    if (isLoading) return <h1>Loading...</h1>;

    return (
        <div className='p2p-v2-my-profile-ad-details'>
            {/* <textarea className='p2p-v2-my-profile-ad-details__textarea' placeholder='My contact details'>
                {advertiserInfo?.contact_info}
            </textarea>
            <span className='p2p-v2-my-profile-ad-details__counter'>0/300</span> */}
            <MyProfileAdDetailsTextarea placeholder='My contact details' value={advertiserInfo?.contact_info} />
            <textarea className='p2p-v2-my-profile-ad-details__textarea' placeholder='Instructions'>
                {advertiserInfo?.default_advert_description}
            </textarea>
            <button>Save</button>
        </div>
    );
};

export default MyProfileAdDetails;
