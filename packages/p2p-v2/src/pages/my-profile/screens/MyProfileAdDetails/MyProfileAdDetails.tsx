import React, { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { useAdvertiserInfo, useAdvertiserUpdate } from '@deriv/api';
import { TextArea } from '../../../../components';
import './MyProfileAdDetails.scss';

const MyProfileAdDetails = () => {
    const { data: advertiserInfo, isLoading } = useAdvertiserInfo();
    const { mutate: updateAdvertiser } = useAdvertiserUpdate();
    const [contactInfo, setContactInfo] = useState('');
    const [advertDescription, setAdvertDescription] = useState('');

    const hasUpdated = useMemo(() => {
        return (
            contactInfo !== advertiserInfo?.contact_info ||
            advertDescription !== advertiserInfo?.default_advert_description
        );
    }, [advertiserInfo?.contact_info, advertiserInfo?.default_advert_description, contactInfo, advertDescription]);

    useEffect(() => {
        setContactInfo(advertiserInfo?.contact_info || '');
        setAdvertDescription(advertiserInfo?.default_advert_description || '');
    }, [advertiserInfo]);

    const submitAdDetails = () => {
        updateAdvertiser({
            contact_info: contactInfo,
            default_advert_description: advertDescription,
        });
    };

    if (isLoading) return <h1>Loading...</h1>;

    return (
        <div className='p2p-v2-my-profile-ad-details'>
            <TextArea
                onChange={e => setContactInfo(e.target.value)}
                placeholder='My contact details'
                value={advertiserInfo?.contact_info || ''}
            />
            <TextArea
                label='This information will be visible to everyone.'
                onChange={e => setAdvertDescription(e.target.value)}
                placeholder='Instructions'
                value={advertiserInfo?.default_advert_description || ''}
            />
            <div className='p2p-v2-my-profile-ad-details__border' />
            {/* TODO: Once Button component is transitioned from @deriv/ui, check button should have Success loading animation when submitted */}
            <button className={clsx(!hasUpdated && 'p2p-v2-my-profile-ad-details--disabled')} onClick={submitAdDetails}>
                Save
            </button>
        </div>
    );
};

export default MyProfileAdDetails;
