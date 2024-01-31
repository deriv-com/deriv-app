import React from 'react';
import { Text } from '@deriv-com/ui';
import { FullPageMobileWrapper } from '../../../../components';
import { useQueryString } from '../../../../hooks';
import { MyProfileStats } from './MyProfileStats';

const MyProfileStatsMobile = () => {
    const { setQueryString } = useQueryString();
    return (
        <FullPageMobileWrapper
            onBack={() =>
                setQueryString({
                    tab: 'default',
                })
            }
            renderHeader={() => (
                <Text lineHeight='xs' size='lg' weight='bold'>
                    Stats
                </Text>
            )}
        >
            <MyProfileStats />
        </FullPageMobileWrapper>
    );
};

export default MyProfileStatsMobile;
