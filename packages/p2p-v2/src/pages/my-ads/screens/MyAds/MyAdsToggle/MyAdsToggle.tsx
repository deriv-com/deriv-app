import React from 'react';
import clsx from 'clsx';
import { useDevice } from '@/hooks';
import { Text, ToggleSwitch } from '@deriv-com/ui';

type TMyAdsToggleProps = {
    isPaused: boolean;
    onClickToggle: () => void;
};
const MyAdsToggle = ({ isPaused, onClickToggle }: TMyAdsToggleProps) => {
    const { isMobile } = useDevice();
    return (
        <div className={clsx('flex gap-[1.6rem] items-center', { 'justify-end w-full': isMobile })}>
            <Text color={isPaused ? 'success' : 'less-prominent'} size={isMobile ? 'md' : 'sm'}>
                Hide my ads
            </Text>
            <ToggleSwitch onChange={onClickToggle} value={isPaused} />
        </div>
    );
};
export default MyAdsToggle;
