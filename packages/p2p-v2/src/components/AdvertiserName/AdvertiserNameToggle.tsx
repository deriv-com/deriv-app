import React, { useEffect, useState, memo } from 'react';
import { useAdvertiserStats } from '../../hooks';
import { ToggleSwitch } from '../ToggleSwitch';
import { useAdvertiserUpdate } from '@deriv/api';
import './AdvertiserNameToggle.scss';

type TAdvertiserNameToggle = {
    onToggle?: (shouldShowRealName: boolean) => void;
};
const AdvertiserNameToggle = memo(({ onToggle }: TAdvertiserNameToggle) => {
    const { data: advertiserInfo } = useAdvertiserStats();
    const [shouldShowRealName, setShouldShowRealName] = useState(false);
    const { mutate: advertiserUpdate } = useAdvertiserUpdate();

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
                <h1>Show my real name</h1>
                <h2>{advertiserInfo?.fullName}</h2>
            </div>
            <ToggleSwitch onChange={onToggleShowRealName} value={shouldShowRealName} />
        </div>
    );
});
AdvertiserNameToggle.displayName = 'AdvertiserNameToggle';

export default AdvertiserNameToggle;
