import React from 'react';
import { Text, ToggleSwitch } from '@deriv-com/ui';
import { useDevice } from '@/hooks';

type TMyAdsToggleProps = {
    isPaused: boolean;
    onClickToggle: () => void;
};
const MyAdsToggle = ({ isPaused, onClickToggle }: TMyAdsToggleProps) => {
    const { isMobile } = useDevice();
    return (
        <div className='flex gap-[1.6rem] items-center'>
            <Text color={isPaused ? 'success' : 'less-prominent'} size={isMobile ? 'md' : 'sm'}>
                Hide my ads
            </Text>
            <ToggleSwitch onChange={onClickToggle} value={isPaused} />
        </div>
    );
};
export default MyAdsToggle;
