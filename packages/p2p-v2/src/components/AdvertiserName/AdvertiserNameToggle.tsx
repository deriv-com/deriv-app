import React, { memo, useEffect, useState } from 'react';
import { TAdvertiserStats } from 'types';
import { p2p } from '@deriv/api-v2';
import { Text, ToggleSwitch } from '@deriv-com/ui';
import './AdvertiserNameToggle.scss';

type TAdvertiserNameToggle = {
    advertiserInfo: TAdvertiserStats;
    onToggle?: (shouldShowRealName: boolean) => void;
};
const AdvertiserNameToggle = memo(({ advertiserInfo, onToggle }: TAdvertiserNameToggle) => {
    const [shouldShowRealName, setShouldShowRealName] = useState(false);
    const { mutate: advertiserUpdate } = p2p.advertiser.useUpdate();

    useEffect(() => {
        setShouldShowRealName(advertiserInfo?.show_name || false);
    }, [advertiserInfo?.show_name]);

    const onToggleShowRealName = () => {
        advertiserUpdate({
            show_name: !shouldShowRealName ? 1 : 0,
        });
        setShouldShowRealName(!shouldShowRealName);
        onToggle?.(!shouldShowRealName);
    };

    return (
        <div className='p2p-v2-advertiser-name-toggle'>
            <div className='p2p-v2-advertiser-name-toggle__label'>
                <Text lineHeight='lg' size='sm'>
                    Show my real name
                </Text>
                <Text className='p2p-v2-advertiser-name-toggle__label-real-name' color='less-prominent' lineHeight='xs'>
                    {advertiserInfo?.fullName}
                </Text>
            </div>
            <ToggleSwitch onChange={onToggleShowRealName} value={shouldShowRealName} />
        </div>
    );
});
AdvertiserNameToggle.displayName = 'AdvertiserNameToggle';

export default AdvertiserNameToggle;
