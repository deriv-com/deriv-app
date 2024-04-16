import React from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { PageReturn, ProfileContent } from '@/components';
import { BUY_SELL_URL, MY_PROFILE_URL } from '@/constants';
import { LabelPairedEllipsisVerticalLgRegularIcon } from '@deriv/quill-icons';
import { useDevice } from '@deriv-com/ui';
import { AdvertiserAdvertsTable } from '../AdvertiserAdvertsTable';
import './Advertiser.scss';

const Advertiser = () => {
    const { isMobile } = useDevice();
    const { advertiserId } = useParams<{ advertiserId: string }>();
    const history = useHistory();
    const location = useLocation();

    return (
        <div className='p2p-v2-advertiser'>
            <PageReturn
                className='lg:mt-0'
                hasBorder={isMobile}
                onClick={() =>
                    history.push(
                        location.state?.from === 'MyProfile' ? `${MY_PROFILE_URL}?tab=My+counterparties` : BUY_SELL_URL
                    )
                }
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
