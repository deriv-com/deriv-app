import React, { PropsWithChildren } from 'react';
import { FullPageMobileWrapper } from '@/components';
import { Button, Text, useDevice } from '@deriv-com/ui';
import { MyAdsToggle } from '../MyAdsToggle';

type TMyAdsDisplayWrapperProps = {
    isPaused: boolean;
    onClickToggle: () => void;
};

const MyAdsButton = () => {
    const { isMobile } = useDevice();

    return (
        <Button isFullWidth={isMobile} size='lg'>
            <Text lineHeight='6xl' size={isMobile ? 'md' : 'sm'} weight='bold'>
                Create new ad
            </Text>
        </Button>
    );
};

const MyAdsDisplayWrapper = ({ children, isPaused, onClickToggle }: PropsWithChildren<TMyAdsDisplayWrapperProps>) => {
    const { isMobile } = useDevice();
    if (isMobile) {
        return (
            <FullPageMobileWrapper
                renderFooter={() => <MyAdsButton />}
                renderHeader={() => <MyAdsToggle isPaused={isPaused} onClickToggle={onClickToggle} />}
                shouldShowBackIcon={false}
            >
                {children}
            </FullPageMobileWrapper>
        );
    }

    return (
        <>
            <div className='flex items-center justify-between my-[1.6rem]'>
                <MyAdsButton />
                <MyAdsToggle isPaused={isPaused} onClickToggle={onClickToggle} />
            </div>
            {children}
        </>
    );
};

export default MyAdsDisplayWrapper;
