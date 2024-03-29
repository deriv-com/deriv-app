import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { PageReturn, ProfileContent } from '@/components';
import { LabelPairedEllipsisVerticalLgRegularIcon } from '@deriv/quill-icons';
import { useDevice } from '@deriv-com/ui';
import { AdvertiserAdvertsTable } from '../AdvertiserAdvertsTable';
import './Advertiser.scss';

const Advertiser = () => {
    const { isMobile } = useDevice();
    const { advertiserId } = useParams<{ advertiserId: string }>();
    const history = useHistory();

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
