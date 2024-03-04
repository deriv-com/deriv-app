import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { PageReturn, ProfileContent } from '@/components';
import { LabelPairedEllipsisVerticalLgRegularIcon } from '@deriv/quill-icons';
import { useDevice } from '@deriv-com/ui';
import { AdvertiserAdvertsTable } from '../AdvertiserAdvertsTable';
import './Advertiser.scss';

const Advertiser = () => {
    const { isMobile } = useDevice();
    const history = useHistory();
    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);
    const advertiserId = urlParams.get('id') ?? undefined;

    return (
        <div className='p2p-v2-advertiser lg:pl-8'>
            <PageReturn
                className='lg:mt-0'
                hasBorder={isMobile}
                onClick={() => history.goBack()}
                pageTitle='Advertiser’s page'
                {...(isMobile && {
                    rightPlaceHolder: <LabelPairedEllipsisVerticalLgRegularIcon className='cursor-pointer' />,
                })}
                weight='bold'
            />
            <ProfileContent id={advertiserId} />
            <AdvertiserAdvertsTable advertiserId={advertiserId} />
        </div>
    );
};

export default Advertiser;
